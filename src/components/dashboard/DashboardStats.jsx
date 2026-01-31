import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function DashboardStats({ issues }) {
  const stats = [
    {
      label: 'Total Reports',
      value: issues.length,
      icon: TrendingUp,
      color: 'blueprint',
      bgColor: 'bg-blueprint/10',
      change: '+12%',
    },
    {
      label: 'Pending',
      value: issues.filter((i) => i.status !== 'resolved' && !i.resolved).length,
      icon: AlertCircle,
      color: 'warning',
      bgColor: 'bg-warning/10',
      change: null,
    },
    {
      label: 'In Progress',
      value: issues.filter((i) => i.status === 'in-progress').length,
      icon: Clock,
      color: 'accent',
      bgColor: 'bg-accent/10',
      change: null,
    },
    {
      label: 'Resolved',
      value: issues.filter((i) => i.status === 'resolved' || i.resolved === true).length,
      icon: CheckCircle,
      color: 'success',
      bgColor: 'bg-success/10',
      change: '+8%',
    },
  ]

  const colorMap = {
    blueprint: 'text-blueprint',
    warning: 'text-warning',
    accent: 'text-accent',
    success: 'text-success',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-cream border border-cream-muted p-5 shadow-paper hover:shadow-paper-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-muted font-body text-sm">{stat.label}</p>
                <p className="font-display text-3xl font-bold text-slate mt-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-success font-display font-medium mt-1">{stat.change} this week</p>
                )}
              </div>
              <div className={`w-10 h-10 ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${colorMap[stat.color]}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
