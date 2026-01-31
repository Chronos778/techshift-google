import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Camera,
  MapPin,
  ChevronRight,
  Sparkles,
  Eye
} from 'lucide-react'
import { Button } from '../components/ui'
import AnimatedBackground from '../components/landing/AnimatedBackground'
import GoogleSection from '../components/landing/GoogleSection'
import StatsSection from '../components/landing/StatsSection'
import HowItWorks from '../components/landing/HowItWorks'
import Leaderboard from '../components/gamification/Leaderboard'

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-gray-300">Powered by Google AI</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Report City Issues.</span>
              <br />
              <span className="gradient-text">AI Verifies Them.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Snap a photo of any city issue. Google Vision detects what it is. 
              <br className="hidden md:block" />
              Gemini writes the official report. City officials take action instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link to="/report">
                <Button size="xl" icon={Camera}>
                  Report an Issue Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl" icon={Eye}>
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-neon-blue font-bold text-xl">100%</div>
                <div className="text-gray-400">AI Verified</div>
              </div>
              <div className="text-gray-600">•</div>
              <div className="text-center">
                <div className="text-neon-purple font-bold text-xl">Real-time</div>
                <div className="text-gray-400">Processing</div>
              </div>
              <div className="text-gray-600">•</div>
              <div className="text-center">
                <div className="text-neon-green font-bold text-xl">Free</div>
                <div className="text-gray-400">For Everyone</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 blur-3xl" />

              {/* Mock app preview */}
              <div className="relative glass rounded-3xl p-2 overflow-hidden">
                <div className="bg-dark-bg rounded-2xl overflow-hidden">
                  {/* Mock header */}
                  <div className="px-6 py-4 border-b border-dark-border flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>

                  {/* Mock content */}
                  <div className="p-8 grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="h-48 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-neon-blue/50" />
                      </div>
                      <div className="h-4 bg-dark-border rounded w-3/4" />
                      <div className="h-4 bg-dark-border rounded w-1/2" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-32 rounded-xl bg-dark-border flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-neon-green/50" />
                      </div>
                      <div className="glass rounded-xl p-4 space-y-2">
                        <div className="h-3 bg-neon-blue/30 rounded w-full" />
                        <div className="h-3 bg-neon-purple/30 rounded w-4/5" />
                        <div className="h-3 bg-neon-green/30 rounded w-3/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Community Leaderboard */}
      <section className="py-20 px-4 bg-dark-card/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Community Champions
            </h2>
            <p className="text-gray-400 text-lg">
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 via-neon-purple/30 to-neon-pink/30 blur-3xl" />

            <div className="relative glass rounded-3xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Help Your City Today
              </h2>
              <p className="text-gray-400 text-lg mb-4 max-w-2xl mx-auto">
                Every report matters. When you submit, AI instantly verifies it and routes it to the right department.
              </p>
              <p className="text-gray-500 text-sm mb-8 max-w-2xl mx-auto">
                Powered by <strong>Google Cloud Vision API</strong>, <strong>Gemini AI</strong>, and <strong>Firebase</strong>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/report">
                  <Button size="xl" icon={ChevronRight} iconPosition="right">
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
      <footer className="py-8 px-4 border-t border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">SmartCity Reporter</span>
          </div>
          <p className="text-gray-500 text-sm">
            Built for people • Powered by Google Technologies
          </p>
        </div>
      </footer>
    </div>
  )
}
