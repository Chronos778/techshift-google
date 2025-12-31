import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalReported: 0,
    resolvedThisMonth: 0,
    averageResolutionTime: 0,
    activeReports: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all issues
        const issuesRef = collection(db, 'issues')
        const allIssuesSnapshot = await getDocs(issuesRef)
        const totalReported = allIssuesSnapshot.size

        // Get resolved issues this month
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const resolvedSnapshot = await getDocs(
          query(issuesRef, where('status', '==', 'resolved'))
        )
        let resolvedThisMonth = 0
        resolvedSnapshot.forEach((doc) => {
          const updatedAt = doc.data().updatedAt?.toDate?.()
          if (updatedAt && updatedAt >= startOfMonth) {
            resolvedThisMonth++
          }
        })

        // Get active reports
        const activeSnapshot = await getDocs(
          query(issuesRef, where('status', 'in', ['pending', 'open', 'in-progress']))
        )
        const activeReports = activeSnapshot.size

        setStats({
          totalReported,
          resolvedThisMonth,
          averageResolutionTime: '2-3 days',
          activeReports,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback to zeros if error
        setStats({
          totalReported: 0,
          resolvedThisMonth: 0,
          averageResolutionTime: '2-3 days',
          activeReports: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsDisplay = [
    { value: stats?.totalReported?.toLocaleString() || '0', label: 'Issues Reported', suffix: '+' },
    { value: stats?.resolvedThisMonth || 0, label: 'Resolved This Month', suffix: '' },
    { value: stats?.averageResolutionTime || '2-3 days', label: 'Avg Resolution', suffix: '' },
    { value: stats?.activeReports || 0, label: 'Active Reports', suffix: '' },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsDisplay.map((stat, index) => (
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
                  {loading ? '...' : `${stat.value}${stat.suffix}`}
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
