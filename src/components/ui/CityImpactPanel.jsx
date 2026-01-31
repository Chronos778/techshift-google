import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, Users, Zap } from 'lucide-react'

const impactStats = [
  {
    id: 'today',
    label: 'Reported Today',
    value: 23,
    icon: TrendingUp,
    color: 'neon-blue',
    trend: '+5 from yesterday',
  },
  {
    id: 'resolved',
    label: 'Resolved This Week',
    value: 147,
    icon: CheckCircle,
    color: 'neon-green',
    trend: '+12% vs last week',
  },
  {
    id: 'time',
    label: 'Avg Resolution',
    value: '2.4',
    suffix: 'days',
    icon: Clock,
    color: 'neon-purple',
    trend: '18% faster',
  },
  {
    id: 'citizens',
    label: 'Active Citizens',
    value: 1247,
    icon: Users,
    color: 'neon-orange',
    trend: '+89 this month',
  },
]

export default function CityImpactPanel({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2))',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          }}
        >
          <Zap className="w-5 h-5 text-neon-blue" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate">City Impact</h2>
          <p className="text-xs text-slate-muted">Real-time community statistics</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative group"
            >
              <div 
                className="relative p-4 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(17, 17, 24, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Background glow on hover */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  style={{
                    background: `radial-gradient(circle at 50% 100%, var(--tw-gradient-from) 0%, transparent 70%)`,
                    '--tw-gradient-from': stat.color === 'neon-blue' ? 'rgba(0, 212, 255, 0.1)' :
                                           stat.color === 'neon-green' ? 'rgba(34, 197, 94, 0.1)' :
                                           stat.color === 'neon-purple' ? 'rgba(168, 85, 247, 0.1)' :
                                           'rgba(249, 115, 22, 0.1)',
                  }}
                />

                {/* Icon */}
                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3`}
                  style={{
                    background: stat.color === 'neon-blue' ? 'rgba(0, 212, 255, 0.15)' :
                                stat.color === 'neon-green' ? 'rgba(34, 197, 94, 0.15)' :
                                stat.color === 'neon-purple' ? 'rgba(168, 85, 247, 0.15)' :
                                'rgba(249, 115, 22, 0.15)',
                  }}
                >
                  <Icon 
                    className="w-4 h-4"
                    style={{
                      color: stat.color === 'neon-blue' ? '#00D4FF' :
                             stat.color === 'neon-green' ? '#22C55E' :
                             stat.color === 'neon-purple' ? '#A855F7' :
                             '#F97316',
                    }}
                  />
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-1">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-slate"
                  >
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </motion.span>
                  {stat.suffix && (
                    <span className="text-sm text-slate-muted">{stat.suffix}</span>
                  )}
                </div>

                {/* Label */}
                <p className="text-xs text-slate-muted mt-1">{stat.label}</p>

                {/* Trend */}
                <div 
                  className="mt-2 text-xs font-medium"
                  style={{
                    color: stat.color === 'neon-blue' ? '#00D4FF' :
                           stat.color === 'neon-green' ? '#22C55E' :
                           stat.color === 'neon-purple' ? '#A855F7' :
                           '#F97316',
                  }}
                >
                  {stat.trend}
                </div>

                {/* Decorative corner accent */}
                <div 
                  className="absolute top-0 right-0 w-16 h-16 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${
                      stat.color === 'neon-blue' ? 'rgba(0, 212, 255, 0.3)' :
                      stat.color === 'neon-green' ? 'rgba(34, 197, 94, 0.3)' :
                      stat.color === 'neon-purple' ? 'rgba(168, 85, 247, 0.3)' :
                      'rgba(249, 115, 22, 0.3)'
                    }, transparent 70%)`,
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center mt-4 gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-neon-green"
        />
        <span className="text-xs text-slate-muted">Live data • Updated every 30 seconds</span>
      </div>
    </motion.div>
  )
}
