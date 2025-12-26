import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Card, StatusBadge, IssueTypeTag } from '../ui'

const statusColors = {
  pending: '#EAB308',
  'in-progress': '#3B82F6',
  resolved: '#22C55E',
}

export default function MapView({ issues, onSelectIssue }) {
  const [hoveredIssue, setHoveredIssue] = useState(null)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map area */}
      <div className="lg:col-span-2">
        <Card hover={false} padding={false} className="overflow-hidden">
          {/* TODO: Firestore real-time listener */}
          {/* TODO: Google Maps JS API */}
          <div className="relative h-[600px]">
            {/* Mock dark map background */}
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px),
                  radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)
                `,
                backgroundSize: '40px 40px, 40px 40px, 100% 100%',
              }}
            />

            {/* Mock city features */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Roads */}
              <path d="M0 30 L100 30" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              <path d="M0 60 L100 60" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <path d="M25 0 L25 100" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              <path d="M50 0 L50 100" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <path d="M75 0 L75 100" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              
              {/* Water feature */}
              <ellipse cx="80" cy="80" rx="15" ry="10" fill="rgba(14,165,233,0.1)" />
            </svg>

            {/* Issue pins */}
            {issues.map((issue, index) => {
              // Distribute pins across the map
              const x = 15 + (index % 4) * 22 + Math.random() * 10
              const y = 15 + Math.floor(index / 4) * 25 + Math.random() * 10

              return (
                <motion.button
                  key={issue.id}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectIssue(issue)}
                  onMouseEnter={() => setHoveredIssue(issue.id)}
                  onMouseLeave={() => setHoveredIssue(null)}
                  className="absolute group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -100%)',
                  }}
                >
                  {/* Pin */}
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: statusColors[issue.status],
                        boxShadow: `0 0 20px ${statusColors[issue.status]}50`,
                      }}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                      style={{ backgroundColor: statusColors[issue.status] }}
                    />
                    
                    {/* Pulse animation */}
                    {issue.status === 'pending' && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: statusColors[issue.status] }}
                      />
                    )}
                  </div>

                  {/* Tooltip */}
                  {hoveredIssue === issue.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 rounded-lg glass-strong shadow-xl z-10"
                    >
                      <IssueTypeTag type={issue.type} size="sm" />
                      <p className="text-white text-xs mt-2 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="mt-2 pt-2 border-t border-dark-border flex items-center justify-between">
                        <StatusBadge status={issue.status} size="sm" />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 glass rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Status</p>
              <div className="space-y-1">
                {Object.entries(statusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-300 capitalize">
                      {status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map controls mock */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white hover:bg-dark-border transition-colors">
                +
              </button>
              <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white hover:bg-dark-border transition-colors">
                −
              </button>
            </div>

            {/* Attribution */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-600">
              © Google Maps
            </div>
          </div>
        </Card>
      </div>

      {/* Side panel - Recent issues */}
      <div className="lg:col-span-1">
        <Card hover={false} className="h-[600px] overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Issues</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
            {issues.slice(0, 10).map((issue) => (
              <motion.button
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                whileHover={{ scale: 1.02 }}
                className="w-full text-left p-3 rounded-xl bg-dark-card border border-dark-border hover:border-neon-blue/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={issue.imageUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <IssueTypeTag type={issue.type} size="sm" />
                    <p className="text-white text-sm mt-1 line-clamp-1">
                      {issue.location.address}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={issue.status} size="sm" />
                      <span className="text-xs text-gray-500">
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
    </div>
  )
}
