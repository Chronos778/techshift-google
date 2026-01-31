import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Layers } from 'lucide-react'
import { Card, StatusBadge, IssueTypeTag } from '../ui'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, HeatmapLayerF } from '@react-google-maps/api'
import { darkMapStyles } from '../../services/maps'

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 37.7749, // Default San Francisco
  lng: -122.4194
};

const libraries = ['visualization'];

const statusColors = {
  pending: '#EAB308',
  open: '#EAB308',
  'in-progress': '#3B82F6',
  verified: '#3B82F6',
  flagged: '#EF4444',
  resolved: '#22C55E',
}

export default function MapView({ issues, onSelectIssue }) {
  const [hoveredIssue, setHoveredIssue] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [showHeatmap, setShowHeatmap] = useState(false)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })

  const [map, setMap] = useState(null)

  useEffect(() => {
    // Log API key status for debugging
    const apiKeySet = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    console.log('Maps API Key Set:', apiKeySet)
    console.log('Current URL:', window.location.href)
    if (loadError) {
      console.error('Maps API Load Error:', loadError)
    }
  }, [loadError])

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const heatmapData = useMemo(() => {
    return issues
      .filter(issue => issue.location?.lat && issue.location?.lng)
      .map(issue => new window.google.maps.LatLng(issue.location.lat, issue.location.lng))
  }, [issues, isLoaded])

  // If API load error, show helpful message
  if (loadError) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card hover={false} padding={false} className="overflow-hidden flex items-center justify-center h-[600px] bg-cream">
            <div className="text-center p-6 max-w-md">
              <h3 className="text-xl font-bold text-slate mb-4">Map Temporarily Unavailable</h3>
              <p className="text-slate-muted mb-4">
                The Google Maps API is initializing. This can take 30-60 seconds when the API key referrer restrictions are being updated.
              </p>
              <div className="bg-cream-dark/50 rounded-lg p-3 mb-4 text-left">
                <p className="text-slate text-sm mb-2"><strong>What you can still do:</strong></p>
                <ul className="text-slate-muted text-sm space-y-1">
                  <li>• View all issues in the list on the right</li>
                  <li>• Click any issue to see details</li>
                  <li>• Map will work after refresh if key is ready</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blueprint text-cream rounded-lg font-semibold hover:bg-blueprint/90 transition"
              >
                Try Refreshing
              </button>
            </div>
          </Card>
        </div>
        <SidePanel issues={issues} onSelectIssue={onSelectIssue} />
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card hover={false} padding={false} className="overflow-hidden flex items-center justify-center h-[600px] bg-cream">
            <div className="text-center p-6">
              <h3 className="text-xl font-bold text-slate mb-2">Map Loading...</h3>
              <p className="text-slate-muted">If this persists, check your Google Maps API Key.</p>
            </div>
          </Card>
        </div>
        <SidePanel issues={issues} onSelectIssue={onSelectIssue} />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card hover={false} padding={false} className="overflow-hidden h-[600px] relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={issues[0]?.location?.lat ? { lat: issues[0].location.lat, lng: issues[0].location.lng } : center}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: darkMapStyles,
              disableDefaultUI: false,
              zoomControl: true,
            }}
          >
            {showHeatmap && heatmapData.length > 0 && (
              <HeatmapLayerF
                data={heatmapData}
                options={{
                  radius: 30,
                  opacity: 0.6,
                }}
              />
            )}

            {!showHeatmap && issues.map(issue => (
              issue.location?.lat && (
                <MarkerF
                  key={issue.id}
                  position={{ lat: issue.location.lat, lng: issue.location.lng }}
                  onClick={() => {
                    setSelectedMarker(issue);
                    onSelectIssue(issue);
                  }}
                >
                  {selectedMarker?.id === issue.id && (
                    <InfoWindowF
                      position={{ lat: issue.location.lat, lng: issue.location.lng }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="bg-white text-black p-2 rounded">
                        <h4 className="font-bold">{issue.type}</h4>
                        <p className="text-sm">{issue.description?.substring(0, 50)}...</p>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              )
            ))}
          </GoogleMap>

          {/* Map Controls */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md transition-colors ${showHeatmap ? 'bg-blueprint text-cream' : 'bg-cream/80 text-slate hover:bg-cream'
                }`}
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Heatmap</span>
            </button>
          </div>
        </Card>
      </div>

      <SidePanel issues={issues} onSelectIssue={onSelectIssue} />
    </div>
  )
}

function SidePanel({ issues, onSelectIssue }) {
  return (
    <div className="lg:col-span-1">
      <Card hover={false} className="h-[600px] overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold text-slate mb-4">Recent Issues</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
          {issues.slice(0, 10).map((issue) => (
            <motion.button
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              whileHover={{ scale: 1.02 }}
              className="w-full text-left p-3 rounded-xl bg-cream-dark/30 border border-cream-muted hover:border-blueprint/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <img
                  src={issue.imageUrl || 'https://via.placeholder.com/150'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <IssueTypeTag type={issue.type} size="sm" />
                  <p className="text-slate text-sm mt-1 line-clamp-1">
                    {issue.location?.address || 'Unknown Location'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <StatusBadge status={issue.status} size="sm" />
                    <span className="text-xs text-slate-muted">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  )
}
