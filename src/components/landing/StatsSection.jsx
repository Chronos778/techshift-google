import { motion, useInView } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

// Animated counter hook
function useAnimatedCounter(targetValue, duration = 1500, startAnimation = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!startAnimation || typeof targetValue !== 'number') {
      setCount(targetValue)
      return
    }
    
    let startTime = null
    const startValue = 0
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(startValue + (targetValue - startValue) * easeOut))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [targetValue, duration, startAnimation])
  
  return count
}

function StatItem({ stat, index, loading, isInView }) {
  const numericValue = typeof stat.value === 'number' ? stat.value : parseInt(stat.value) || 0
  const animatedValue = useAnimatedCounter(numericValue, 1500, isInView && !loading)
  const displayValue = loading ? '—' : (typeof stat.value === 'string' && isNaN(parseInt(stat.value)) ? stat.value : animatedValue.toLocaleString())
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="relative group"
    >
      {/* Hover background */}
      <div className="absolute inset-0 bg-cream/0 group-hover:bg-cream/5 transition-colors duration-300" />
      
      {/* Content */}
      <div className="relative py-8 px-4 text-center">
        {/* Number */}
        <div className="relative inline-block">
          <span className="font-display text-5xl md:text-6xl font-bold text-cream tracking-tight tabular-nums">
            {displayValue}
          </span>
          {stat.suffix && (
            <span className="font-display text-2xl md:text-3xl font-bold text-accent ml-0.5">
              {stat.suffix}
            </span>
          )}
        </div>
        
        {/* Label */}
        <div className="mt-3 font-display text-xs uppercase tracking-[0.2em] text-cream/60">
          {stat.label}
        </div>
        
        {/* Accent underline on hover */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent group-hover:w-16 transition-all duration-300" />
      </div>
      
      {/* Vertical divider */}
      {index < 3 && (
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-cream/10" />
      )}
    </motion.div>
  )
}

export default function StatsSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const [stats, setStats] = useState({
    totalReported: 0,
    resolvedThisMonth: 0,
    averageResolutionTime: '2-3',
    activeReports: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const issuesRef = collection(db, 'issues')
        const allIssuesSnapshot = await getDocs(issuesRef)
        const totalReported = allIssuesSnapshot.size

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

        const activeSnapshot = await getDocs(
          query(issuesRef, where('status', 'in', ['pending', 'open', 'in-progress']))
        )
        const activeReports = activeSnapshot.size

        setStats({
          totalReported,
          resolvedThisMonth,
          averageResolutionTime: '2-3',
          activeReports,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats({
          totalReported: 0,
          resolvedThisMonth: 0,
          averageResolutionTime: '2-3',
          activeReports: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsDisplay = [
    { value: stats?.totalReported || 0, label: 'Issues Reported', suffix: '+' },
    { value: stats?.resolvedThisMonth || 0, label: 'Resolved This Month', suffix: '' },
    { value: stats?.averageResolutionTime || '2-3', label: 'Avg Days to Resolve', suffix: 'd' },
    { value: stats?.activeReports || 0, label: 'Active Reports', suffix: '' },
  ]

  return (
    <section ref={containerRef} className="py-16 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate" />
      
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(247, 245, 240, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(247, 245, 240, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="font-display text-xs font-medium uppercase tracking-[0.25em] text-cream/70">
            Platform Impact
          </span>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-cream/[0.02] border border-cream/10">
          {statsDisplay.map((stat, index) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={index}
              loading={loading}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
