import { motion } from 'framer-motion'
import { mockStats } from '../../mock/issues'

export default function StatsSection() {
  const stats = [
    { value: mockStats.totalReported.toLocaleString(), label: 'Issues Reported', suffix: '+' },
    { value: mockStats.resolvedThisMonth, label: 'Resolved This Month', suffix: '' },
    { value: mockStats.averageResolutionTime, label: 'Avg Resolution', suffix: '' },
    { value: mockStats.activeReports, label: 'Active Reports', suffix: '' },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-6">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
