import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

export default function AnimatedBackground() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  // Smooth parallax transforms
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), { stiffness: 50, damping: 20 })
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), { stiffness: 50, damping: 20 })
  const y3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), { stiffness: 50, damping: 20 })
  const rotate1 = useSpring(useTransform(scrollYProgress, [0, 1], [12, 25]), { stiffness: 50, damping: 20 })
  const rotate2 = useSpring(useTransform(scrollYProgress, [0, 1], [45, 60]), { stiffness: 50, damping: 20 })
  
  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base warm cream */}
      <div className="absolute inset-0 bg-cream" />
      
      {/* Animated gradient orbs - Premium effect */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full bg-gradient-radial from-accent/20 via-accent/5 to-transparent blur-3xl" />
      </motion.div>
      
      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.04, 0.06, 0.04],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="w-full h-full bg-gradient-radial from-blueprint/20 via-blueprint/5 to-transparent blur-3xl" />
      </motion.div>
      
      {/* Blueprint grid pattern - with mask for premium fade */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(#3B7DD8 1px, transparent 1px),
            linear-gradient(90deg, #3B7DD8 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)',
        }}
      />

      {/* Premium topographic contour lines with animation */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1600 900">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B7DD8" stopOpacity="0" />
            <stop offset="20%" stopColor="#3B7DD8" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#3B7DD8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3B7DD8" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {[150, 250, 350, 450, 550, 650, 750].map((yPos, i) => (
          <motion.path
            key={yPos}
            d={`M-100,${yPos} Q200,${yPos - 50 + i * 10} 400,${yPos} T800,${yPos} T1200,${yPos} T1700,${yPos}`}
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth={1 - i * 0.08}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              d: [
                `M-100,${yPos} Q200,${yPos - 50 + i * 10} 400,${yPos} T800,${yPos} T1200,${yPos} T1700,${yPos}`,
                `M-100,${yPos} Q200,${yPos - 30 + i * 10} 400,${yPos + 20} T800,${yPos - 10} T1200,${yPos + 10} T1700,${yPos}`,
                `M-100,${yPos} Q200,${yPos - 50 + i * 10} 400,${yPos} T800,${yPos} T1200,${yPos} T1700,${yPos}`,
              ]
            }}
            transition={{ 
              pathLength: { duration: 1.5 + i * 0.2, ease: "easeOut" },
              opacity: { duration: 0.5, delay: i * 0.1 },
              d: { duration: 20, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}
      </svg>

      {/* Geometric floating shapes with parallax */}
      <motion.div
        style={{ y: y3, rotate: rotate1 }}
        className="absolute top-[15%] right-[15%] w-72 h-72"
      >
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full border-2 border-blueprint/50"
        />
      </motion.div>
      
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute bottom-[20%] left-[10%] w-56 h-56"
      >
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-full h-full border-2 border-accent/40"
        />
      </motion.div>
      
      {/* Small decorative squares */}
      {[
        { top: '30%', left: '5%', size: 8, delay: 0 },
        { top: '60%', right: '8%', size: 6, delay: 1 },
        { top: '75%', left: '15%', size: 10, delay: 2 },
        { top: '20%', right: '25%', size: 4, delay: 3 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute bg-accent/40"
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: dot.delay,
          }}
        />
      ))}

      {/* Premium corner marks with animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-slate/30"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-20 right-20 w-20 h-20 border-t-2 border-r-2 border-slate/30"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-20 left-20 w-20 h-20 border-b-2 border-l-2 border-slate/30"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-20 right-20 w-20 h-20 border-b-2 border-r-2 border-slate/30"
      />

      {/* Soft vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-cream/30 pointer-events-none" />
    </div>
  )
}
