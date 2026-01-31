import { motion } from 'framer-motion'
import { FileText, Eye, Wrench, CheckCircle } from 'lucide-react'

const stages = [
  { id: 'submitted', label: 'Submitted', icon: FileText, description: 'Report received' },
  { id: 'reviewed', label: 'Reviewed', icon: Eye, description: 'Under assessment' },
  { id: 'in-progress', label: 'In Progress', icon: Wrench, description: 'Work started' },
  { id: 'fixed', label: 'Fixed', icon: CheckCircle, description: 'Issue resolved' },
]

const statusToStage = {
  'pending': 0,
  'in-progress': 2,
  'resolved': 3,
}

export default function StatusTimeline({ status, timeline = [], className = '' }) {
  const currentStageIndex = statusToStage[status] ?? 0

  return (
    <div className={`relative ${className}`}>
      {/* Background track */}
      <div className="absolute top-8 left-8 right-8 h-1 bg-cream-muted rounded-full" />
      
      {/* Progress fill */}
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-8 left-8 h-1 bg-gradient-to-r from-neon-blue to-neon-green rounded-full"
        style={{
          maxWidth: 'calc(100% - 64px)',
          boxShadow: '0 0 15px rgba(0, 212, 255, 0.5)',
        }}
      />

      {/* Animated particle on progress line */}
      {currentStageIndex < stages.length - 1 && (
        <motion.div
          animate={{
            x: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-7 h-3 w-3 bg-neon-blue rounded-full"
          style={{
            left: `calc(${(currentStageIndex / (stages.length - 1)) * 100}% + 32px - 6px)`,
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
          }}
        />
      )}

      {/* Stage nodes */}
      <div className="relative flex justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentStageIndex
          const isCurrent = index === currentStageIndex
          const Icon = stage.icon

          // Find matching timeline event
          const timelineEvent = timeline.find(t => 
            (t.status === stage.id) || 
            (stage.id === 'submitted' && t.status === 'reported') ||
            (stage.id === 'reviewed' && t.status === 'acknowledged') ||
            (stage.id === 'in-progress' && t.status === 'in-progress') ||
            (stage.id === 'fixed' && t.status === 'resolved')
          )

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              {/* Node */}
              <motion.div
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
                className="relative"
              >
                {/* Glow ring for current */}
                {isCurrent && (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: isCompleted 
                        ? 'rgba(34, 197, 94, 0.3)' 
                        : 'rgba(0, 212, 255, 0.3)',
                    }}
                  />
                )}
                
                <div
                  className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center
                    transition-all duration-500 border-2
                    ${isCompleted 
                      ? 'bg-green-100 border-green-500 text-green-600' 
                      : 'bg-cream border-cream-muted text-slate-muted'
                    }
                  `}
                  style={isCompleted ? {
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                  } : {}}
                >
                  <Icon className="w-6 h-6" />
                  
                  {/* Checkmark overlay for completed */}
                  {isCompleted && index < currentStageIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-green flex items-center justify-center"
                    >
                      <CheckCircle className="w-3 h-3 text-dark-bg" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Label */}
              <div className="mt-3 text-center">
                <p className={`text-sm font-medium ${isCompleted ? 'text-slate' : 'text-slate-muted'}`}>
                  {stage.label}
                </p>
                <p className="text-xs text-slate-muted mt-0.5">
                  {stage.description}
                </p>
                {timelineEvent && (
                  <p className="text-xs text-neon-blue mt-1">
                    {new Date(timelineEvent.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
