import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink } from 'lucide-react'
import StatusBadge from './StatusBadge'
import IssueTypeTag from './IssueTypeTag'

// Helper function to format time ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  return 'Just now'
}

// Issue type icons
const issueIcons = {
  pothole: '🕳️',
  streetlight: '💡',
  graffiti: '🎨',
  garbage: '🗑️',
  'road-damage': '🚧',
  flooding: '🌊',
  tree: '🌳',
  other: '📍',
}

export default function IssueCard({ issue, onClick, variant = 'default' }) {
  const isCompact = variant === 'compact'

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group cursor-pointer"
    >
      <div 
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(17, 17, 24, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.1), transparent 50%)',
          }}
        />

        {/* Image section */}
        <div className="relative">
          <img
            src={issue.imageUrl}
            alt={issue.type}
            className={`w-full object-cover ${isCompact ? 'h-32' : 'h-44'}`}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
          
          {/* Issue icon badge */}
          <div className="absolute top-3 left-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: 'rgba(17, 17, 24, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {issueIcons[issue.type] || '📍'}
            </motion.div>
          </div>

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={issue.status} />
          </div>

          {/* Time ago badge */}
          <div className="absolute bottom-3 right-3">
            <div 
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-gray-300"
              style={{
                background: 'rgba(17, 17, 24, 0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Clock className="w-3 h-3" />
              {timeAgo(issue.createdAt)}
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="p-4">
          {/* Issue type tag */}
          <div className="mb-3">
            <IssueTypeTag type={issue.type} size="sm" />
          </div>

          {/* Description preview */}
          {!isCompact && (
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {issue.description}
            </p>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-neon-blue shrink-0" />
            <span className="text-xs truncate">{issue.location.address}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
            <span className="text-xs text-gray-500">
              #{issue.id.split('_')[1]}
            </span>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-neon-blue text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View details
              <ExternalLink className="w-3 h-3" />
            </motion.div>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue"
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  )
}
