import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, Users, Zap, ArrowUpRight } from 'lucide-react'

const impactStats = [
  {
    id: 'today',
    label: 'Reported Today',
    value: 23,
    icon: TrendingUp,
    color: 'blueprint',
    bgColor: 'bg-blueprint/10',
    textColor: 'text-blueprint',
    trend: '+5 from yesterday',
  },
  {
    id: 'resolved',
    label: 'Resolved This Week',
    value: 147,
    icon: CheckCircle,
    color: 'success',
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    trend: '+12% vs last week',
  },
  {
    id: 'time',
    label: 'Avg Resolution',
    value: '2.4',
    suffix: 'days',
    icon: Clock,
    color: 'accent',
    bgColor: 'bg-accent/10',
    textColor: 'text-accent',
    trend: '18% faster',
  },
  {
    id: 'citizens',
    label: 'Active Citizens',
    value: 1247,
    icon: Users,
    color: 'warning',
    bgColor: 'bg-warning/10',
    textColor: 'text-warning',
    trend: '+89 this month',
  },
]

export default function CityImpactPanel({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-cream border-2 border-cream-muted p-6 shadow-paper ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 flex items-center justify-center border border-accent/20">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-slate">City Impact</h2>
          <p className="text-xs text-slate-muted font-body">Real-time community statistics</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="group relative bg-cream border-2 border-cream-muted p-4 hover:border-slate/20 transition-all duration-300"
            >
              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-12 h-12 ${stat.bgColor} opacity-50`}
                style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
              />

              {/* Icon */}
              <div className={`w-10 h-10 ${stat.bgColor} flex items-center justify-center mb-3 border border-cream-muted`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-slate">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-sm text-slate-muted font-body">{stat.suffix}</span>
                )}
              </div>

              {/* Label */}
              <p className="text-xs text-slate-muted font-display mt-1">{stat.label}</p>

              {/* Trend */}
              <div className={`mt-3 flex items-center gap-1 text-xs font-display font-semibold ${stat.textColor}`}>
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </div>

              {/* Bottom accent line on hover */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  stat.color === 'blueprint' ? 'bg-blueprint' :
                  stat.color === 'success' ? 'bg-success' :
                  stat.color === 'accent' ? 'bg-accent' : 'bg-warning'
                }`}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center mt-6 pt-4 border-t border-cream-muted gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-success"
        />
        <span className="text-xs text-slate-muted font-display">Live data • Updated every 30 seconds</span>
      </div>
    </motion.div>
  )
}
