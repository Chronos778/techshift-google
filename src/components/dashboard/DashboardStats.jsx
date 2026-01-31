import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function DashboardStats({ issues }) {
  const stats = [
    {
      label: 'Total Reports',
      value: issues.length,
      icon: TrendingUp,
      color: 'neon-blue',
      change: '+12%',
    },
    {
      label: 'Pending',
      value: issues.filter((i) => i.status !== 'resolved' && !i.resolved).length,
      icon: AlertCircle,
      color: 'yellow-500',
      change: null,
    },
    {
      label: 'In Progress',
      value: issues.filter((i) => i.status === 'in-progress').length,
      icon: Clock,
      color: 'neon-purple',
      change: null,
    },
    {
      label: 'Resolved',
      value: issues.filter((i) => i.status === 'resolved' || i.resolved === true).length,
      icon: CheckCircle,
      color: 'neon-green',
      change: '+8%',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-neon-green mt-1">{stat.change} this week</p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
