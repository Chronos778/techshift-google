import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin, Navigation, Map as MapIcon } from 'lucide-react'
import { Button, Card } from '../ui'
import { getCurrentLocation } from '../../services/maps'

export default function StepLocation({ reportData, updateReportData, onNext, onBack }) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [manualAddress, setManualAddress] = useState('')

  const handleDetectLocation = async () => {
    setIsDetecting(true)
    try {
      // TODO: Google Maps JS API + Geolocation
      const location = await getCurrentLocation()
      updateReportData({
        location: {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
        },
      })
      setManualAddress(location.address)
    } catch (error) {
      console.error('Location error:', error)
      let msg = 'Unable to detect location.'
      if (error.code === 1) msg = 'Location permission denied. Please enable it in your browser settings.'
      else if (error.code === 2) msg = 'Location unavailable. Please check your network or try manually entering address.'
      else if (error.code === 3) msg = 'Location request timed out. Please try again.'

      alert(msg)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleAddressChange = (e) => {
    setManualAddress(e.target.value)
    updateReportData({
      location: {
        ...reportData.location,
        address: e.target.value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Pin the Location
        </h2>
        <p className="text-gray-400 mb-6">
          Help city officials locate this issue. We'll use your location and map it on the city dashboard.
        </p>

        {/* Location detection button */}
        <Button
          onClick={handleDetectLocation}
          loading={isDetecting}
          variant={reportData.location ? 'secondary' : 'primary'}
          icon={Navigation}
          className="w-full mb-6"
          size="lg"
        >
          {isDetecting ? 'Detecting Location...' : 'Detect My Location'}
        </Button>

        {/* Mock map */}
        <div className="relative rounded-2xl overflow-hidden bg-dark-card border border-dark-border mb-6">
          {/* TODO: Google Maps JS API + Geolocation */}
          <div className="h-64 relative">
            {/* Mock map background with grid */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px),
                  linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f3460 100%)
                `,
                backgroundSize: '30px 30px, 30px 30px, 100% 100%',
              }}
            />

            {/* Mock roads */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700/50" />
            <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-gray-700/50" />
            <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-gray-700/30" />

            {/* Location pin */}
            {reportData.location && (
              <motion.div
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-neon-blue flex items-center justify-center shadow-lg shadow-neon-blue/50">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-neon-blue rotate-45" />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-neon-blue/30"
                  />
                </div>
              </motion.div>
            )}

            {/* Map overlay */}
            {!reportData.location && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/50 backdrop-blur-sm">
                <div className="text-center">
                  <MapIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Click "Detect My Location" to pin the issue</p>
                </div>
              </div>
            )}
          </div>

          {/* Map attribution mock */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-dark-bg/80 px-2 py-1 rounded">
            © Google Maps
          </div>
        </div>

        {/* Address input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Address / Location Details
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={manualAddress}
              onChange={handleAddressChange}
              placeholder="Enter address or cross-streets..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-neon-blue/50 focus:outline-none text-white placeholder-gray-600"
            />
          </div>
          {reportData.location && reportData.location.lat && reportData.location.lng && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-gray-500"
            >
              Coordinates: {reportData.location.lat.toFixed(4)}, {reportData.location.lng.toFixed(4)}
            </motion.p>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!reportData.location?.address}
          icon={ArrowRight}
          iconPosition="right"
          size="lg"
        >
          Review Report
        </Button>
      </div>
    </div>
  )
}
