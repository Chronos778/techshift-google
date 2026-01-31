import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

// Animated counter hook
function useAnimatedCounter(value, duration = 1) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayValue(Math.round(v))
    })
    return () => controls.stop()
  }, [value, duration])
  
  return displayValue
}

// Individual stat card with premium styling
function StatCard({ stat, index, colorMap }) {
  const animatedValue = useAnimatedCounter(stat.value, 1.2)
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1 + 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-cream border-2 border-cream-muted p-6 shadow-paper hover:shadow-paper-lg transition-all duration-300 overflow-hidden"
    >
      {/* Hover gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03] transition-opacity duration-300`}
      />
      
      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bgColor} opacity-50`} 
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p className="text-slate-muted font-display text-xs uppercase tracking-wider mb-2">
            {stat.label}
          </p>
          
          {/* Value with animated counter */}
          <div className="flex items-baseline gap-2">
            <motion.p 
              className="font-display text-4xl font-bold text-slate tracking-tight"
            >
              {animatedValue}
            </motion.p>
            {stat.change && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
                className="flex items-center gap-0.5 text-success font-display text-sm font-semibold"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stat.change}
              </motion.span>
            )}
          </div>
          
          {/* Subtext */}
          {stat.subtext && (
            <p className="text-slate-muted font-body text-xs mt-2">
              {stat.subtext}
            </p>
          )}
        </div>
        
        {/* Icon container */}
        <motion.div 
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.2 }}
          className={`w-12 h-12 ${stat.bgColor} flex items-center justify-center border-2 border-cream-muted group-hover:border-current transition-colors`}
        >
          <stat.icon className={`w-6 h-6 ${colorMap[stat.color]}`} strokeWidth={2} />
        </motion.div>
      </div>
      
      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${stat.accentBg} origin-left`}
      />
    </motion.div>
  )
}

export default function DashboardStats({ issues }) {
  const resolvedCount = issues.filter((i) => i.status === 'resolved' || i.resolved === true).length
  const totalCount = issues.length
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0
  
  const stats = [
    {
      label: 'Total Reports',
      value: issues.length,
      icon: TrendingUp,
      color: 'blueprint',
      bgColor: 'bg-blueprint/10',
      accentBg: 'bg-blueprint',
      gradient: 'from-blueprint to-blueprint-light',
      change: null,
      subtext: 'City-wide issues tracked'
    },
    {
      label: 'Pending Review',
      value: issues.filter((i) => i.status !== 'resolved' && !i.resolved && i.status !== 'in-progress').length,
      icon: AlertCircle,
      color: 'warning',
      bgColor: 'bg-warning/10',
      accentBg: 'bg-warning',
      gradient: 'from-warning to-warning-light',
      change: null,
      subtext: 'Awaiting verification'
    },
    {
      label: 'In Progress',
      value: issues.filter((i) => i.status === 'in-progress').length,
      icon: Clock,
      color: 'accent',
      bgColor: 'bg-accent/10',
      accentBg: 'bg-accent',
      gradient: 'from-accent to-accent-hover',
      change: null,
      subtext: 'Being addressed'
    },
    {
      label: 'Resolved',
      value: resolvedCount,
      icon: CheckCircle,
      color: 'success',
      bgColor: 'bg-success/10',
      accentBg: 'bg-success',
      gradient: 'from-success to-success-light',
      change: resolutionRate > 0 ? `${resolutionRate}%` : null,
      subtext: 'Successfully completed'
    },
  ]

  const colorMap = {
    blueprint: 'text-blueprint',
    warning: 'text-warning',
    accent: 'text-accent',
    success: 'text-success',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-8 h-8 bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-slate">Overview Statistics</h2>
          <p className="text-slate-muted font-body text-sm">Real-time city issue metrics</p>
        </div>
      </motion.div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard 
            key={stat.label} 
            stat={stat} 
            index={index}
            colorMap={colorMap}
          />
        ))}
      </div>
    </div>
  )
}
