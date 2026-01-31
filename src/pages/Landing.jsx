import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Camera,
  MapPin,
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { Button } from '../components/ui'
import AnimatedBackground from '../components/landing/AnimatedBackground'
import GoogleSection from '../components/landing/GoogleSection'
import StatsSection from '../components/landing/StatsSection'
import HowItWorks from '../components/landing/HowItWorks'
import Leaderboard from '../components/gamification/Leaderboard'
import { useRef } from 'react'

// Premium stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-24 px-4">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="max-w-6xl mx-auto w-full"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-slate mb-8 relative overflow-hidden group"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                />
                <Zap className="w-4 h-4 text-accent" strokeWidth={2.5} />
                <span className="text-xs font-display font-semibold uppercase tracking-wider text-slate">
                  Powered by Google AI
                </span>
              </motion.div>

              {/* Main Headline with character animation */}
              <motion.h1 
                variants={itemVariants}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight"
              >
                <span className="text-slate block">Report City Issues.</span>
                <motion.span 
                  className="gradient-text-accent block"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  AI Verifies Them.
                </motion.span>
              </motion.h1>

              {/* Subtext */}
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-muted font-body leading-relaxed max-w-xl mb-10"
              >
                Snap a photo of any city issue. Google Vision detects what it is. 
                Gemini writes the official report. City officials take action instantly.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start gap-4 mb-12"
              >
                <Link to="/report">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="xl" icon={Camera}>
                      Report an Issue
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="secondary" size="xl" icon={Shield}>
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                variants={itemVariants}
                className="flex gap-8 md:gap-10"
              >
                {[
                  { value: '100%', label: 'AI Verified', color: 'text-accent' },
                  { value: 'Real-time', label: 'Processing', color: 'text-blueprint' },
                  { value: 'Free', label: 'For Everyone', color: 'text-success' },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    className="text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <div className={`font-display font-bold text-2xl ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm font-display uppercase tracking-wide text-slate-muted">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block perspective-1000"
            >
              {/* Main card mockup */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02, rotateY: 2 }}
                transition={{ duration: 0.4 }}
              >
                {/* Corner decorations */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-accent"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-accent"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 }}
                  className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-accent"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-accent"
                />

                {/* Card */}
                <div className="bg-cream border border-cream-muted shadow-lg p-2 relative">
                  <div className="bg-slate p-6">
                    {/* Mock header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-light">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-danger"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-warning"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-success"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                      />
                      <span className="ml-2 font-display text-xs uppercase tracking-wider text-cream/70">
                        SmartCity Reporter
                      </span>
                    </div>

                    {/* Mock content */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <motion.div 
                          className="aspect-[4/3] bg-slate-light flex items-center justify-center border border-slate-muted overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Camera className="w-12 h-12 text-cream/30" strokeWidth={1.5} />
                        </motion.div>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ delay: 1.2, duration: 0.8 }}
                          className="h-3 bg-cream/10"
                        />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '50%' }}
                          transition={{ delay: 1.4, duration: 0.6 }}
                          className="h-3 bg-cream/10"
                        />
                      </div>
                      <div className="space-y-4">
                        <motion.div 
                          className="aspect-[4/3] bg-slate-light flex items-center justify-center border border-slate-muted"
                          whileHover={{ scale: 1.02 }}
                        >
                          <MapPin className="w-10 h-10 text-accent/50" strokeWidth={1.5} />
                        </motion.div>
                        <div className="bg-slate-light border border-slate-muted p-3 space-y-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="h-2 bg-accent/40"
                          />
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '80%' }}
                            transition={{ delay: 1.6, duration: 0.5 }}
                            className="h-2 bg-blueprint/40"
                          />
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ delay: 1.7, duration: 0.5 }}
                            className="h-2 bg-success/40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    y: [0, -8, 0],
                  }}
                  transition={{ 
                    opacity: { delay: 1, duration: 0.5 },
                    x: { delay: 1, duration: 0.5 },
                    y: { delay: 1.5, duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className="absolute -right-6 top-1/4 bg-accent text-cream px-4 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider">AI Verified</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-slate-muted"
          >
            <span className="text-xs font-display uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Community Leaderboard */}
      <section className="py-24 px-4 bg-slate">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
              Community Impact
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4 tracking-tight">
              Community Champions
            </h2>
            <p className="text-cream/80 font-body text-lg max-w-xl mx-auto">
              Earn points, unlock badges, and become a guardian of your city.
            </p>
          </motion.div>
          <Leaderboard />
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Google Section */}
      <GoogleSection />

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Border frame */}
            <div className="absolute -inset-4 border-2 border-slate/25 pointer-events-none" />
            
            <div className="bg-cream border border-cream-muted shadow-paper-lg p-12 md:p-16 text-center relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent" />

              <span className="inline-block font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                Get Started Today
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate mb-4 tracking-tight">
                Help Your City Today
              </h2>
              <p className="text-slate-muted font-body text-lg mb-4 max-w-2xl mx-auto">
                Every report matters. When you submit, AI instantly verifies it and routes it to the right department.
              </p>
              <p className="text-slate-muted/60 font-body text-sm mb-10 max-w-2xl mx-auto">
                Powered by <strong className="text-slate">Google Cloud Vision API</strong>, <strong className="text-slate">Gemini AI</strong>, and <strong className="text-slate">Firebase</strong>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/report">
                  <Button size="xl" icon={ArrowRight} iconPosition="right">
                    Start Reporting
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="xl">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-cream-muted bg-cream-dark/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate flex items-center justify-center">
              <MapPin className="w-5 h-5 text-cream" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-display font-bold text-slate">SmartCity Reporter</span>
            </div>
          </div>
          <p className="text-slate-muted font-display text-sm uppercase tracking-wider">
            Built for people • Powered by Google Technologies
          </p>
        </div>
      </footer>
    </div>
  )
}
