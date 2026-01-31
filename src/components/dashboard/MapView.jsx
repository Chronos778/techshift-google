import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Layers, Navigation, ChevronRight, AlertCircle, Map as MapIcon } from 'lucide-react'
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-cream border-2 border-cream-muted shadow-paper overflow-hidden h-[600px]"
        >
          {/* Map Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate/90 via-slate/60 to-transparent p-4 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="w-8 h-8 bg-blueprint/20 backdrop-blur-sm flex items-center justify-center">
                <MapIcon className="w-4 h-4 text-blueprint" />
              </div>
              <span className="font-display text-sm font-semibold text-cream">
                Interactive Map View
              </span>
            </div>
          </div>

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
                      <div className="bg-cream text-slate p-2">
                        <h4 className="font-display font-bold text-sm">{issue.type}</h4>
                        <p className="text-xs font-body text-slate-muted">{issue.description?.substring(0, 50)}...</p>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              )
            ))}
          </GoogleMap>

          {/* Map Controls */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-16 left-4 flex gap-2"
          >
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-2 px-4 py-2.5 backdrop-blur-md transition-all duration-300 font-display text-sm font-medium border-2 ${
                showHeatmap 
                  ? 'bg-blueprint text-cream border-blueprint' 
                  : 'bg-cream/90 text-slate border-cream-muted hover:border-blueprint/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Heatmap
            </button>
          </motion.div>
          
          {/* Issue count badge */}
          <div className="absolute bottom-4 left-4 bg-slate/90 backdrop-blur-sm px-4 py-2 border border-cream/20">
            <span className="font-display text-sm text-cream">
              <span className="font-bold">{issues.length}</span> issues visible
            </span>
          </div>
        </motion.div>
      </div>

      <SidePanel issues={issues} onSelectIssue={onSelectIssue} />
    </div>
  )
}

function SidePanel({ issues, onSelectIssue }) {
  return (
    <div className="lg:col-span-1">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-cream border-2 border-cream-muted h-[600px] overflow-hidden flex flex-col shadow-paper"
      >
        {/* Header */}
        <div className="p-5 border-b-2 border-cream-muted">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate">Recent Issues</h3>
              <p className="text-slate-muted font-body text-xs">
                {issues.length} total on map
              </p>
            </div>
          </div>
        </div>

        {/* Issues list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {issues.slice(0, 10).map((issue, index) => (
              <motion.button
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectIssue(issue)}
                whileHover={{ x: 4 }}
                className="group w-full text-left p-3 bg-cream border-2 border-cream-muted hover:border-blueprint/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-14 shrink-0">
                    <img
                      src={issue.imageUrl || 'https://via.placeholder.com/150'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border border-cream-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <IssueTypeTag type={issue.type} size="sm" />
                    <p className="text-slate text-sm mt-1.5 line-clamp-1 font-body">
                      {issue.location?.address || 'Unknown Location'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={issue.status} size="sm" />
                      <span className="text-xs text-slate-muted font-display">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-muted opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
          
          {issues.length > 10 && (
            <p className="text-center text-slate-muted font-display text-xs pt-2">
              +{issues.length - 10} more issues
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
