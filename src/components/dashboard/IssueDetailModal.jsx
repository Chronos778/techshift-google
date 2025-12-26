import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Loader, Brain } from 'lucide-react'
import { StatusBadge, IssueTypeTag, StatusTimeline } from '../ui'

const statusIcons = {
  reported: AlertCircle,
  acknowledged: Clock,
  'in-progress': Loader,
  resolved: CheckCircle,
}

const statusColors = {
  reported: 'text-yellow-400',
  acknowledged: 'text-blue-400',
  'in-progress': 'text-purple-400',
  resolved: 'text-green-400',
}

export default function IssueDetailModal({ issue, isOpen, onClose }) {
  if (!issue) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50 px-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="glass-strong rounded-2xl overflow-hidden">
              {/* Header with image */}
              <div className="relative h-64">
                <img
                  src={issue.imageUrl}
                  alt={issue.type}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full glass text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Issue info overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3 mb-2">
                    <IssueTypeTag type={issue.type} size="lg" />
                    <StatusBadge status={issue.status} size="lg" />
                  </div>
                  <p className="text-sm text-gray-400">
                    Report #{issue.id.split('_')[1]}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">AI-Generated Description</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-neon-purple" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {issue.description}
                    </p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    AI Confidence: {(issue.aiConfidence * 100).toFixed(0)}%
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Location</h3>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-card border border-dark-border">
                    <MapPin className="w-5 h-5 text-neon-green shrink-0" />
                    <div>
                      <p className="text-white">{issue.location.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {issue.location.lat.toFixed(6)}, {issue.location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline - New horizontal animated timeline */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-4">Status Timeline</h3>
                  {/* TODO: Update status via Firestore */}
                  <StatusTimeline status={issue.status} />
                  
                  {/* Detailed timeline events */}
                  <div className="mt-6 space-y-3">
                    {issue.timeline.map((event, index) => {
                      const Icon = statusIcons[event.status] || AlertCircle
                      const isLast = index === issue.timeline.length - 1

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isLast ? 'bg-neon-blue/10 border border-neon-blue/20' : 'bg-dark-card/50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${statusColors[event.status]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium capitalize">
                              {event.status.replace('-', ' ')}
                            </p>
                            <p className="text-gray-500 text-xs truncate">{event.note}</p>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    Reported on {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Reported by:</span>
                    <span className="text-sm text-white">{issue.reportedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
