import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Camera, 
  MapPin, 
  Zap, 
  Shield, 
  Clock, 
  ChevronRight,
  Sparkles,
  Eye,
  Brain,
  Map as MapIcon
} from 'lucide-react'
import { Button, Card } from '../components/ui'
import AnimatedBackground from '../components/landing/AnimatedBackground'
import GoogleSection from '../components/landing/GoogleSection'
import StatsSection from '../components/landing/StatsSection'
import HowItWorks from '../components/landing/HowItWorks'

export default function Landing() {
  const features = [
    {
      icon: Camera,
      title: 'Snap & Report',
      description: 'Simply take a photo of any city issue - potholes, broken lights, graffiti, and more.',
      color: 'neon-blue',
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Google Vision AI automatically identifies the issue type and generates detailed descriptions.',
      color: 'neon-purple',
    },
    {
      icon: MapIcon,
      title: 'Precise Location',
      description: 'Automatic geolocation pins the exact spot for quick municipal response.',
      color: 'neon-green',
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Track your report status from submission to resolution on our live dashboard.',
      color: 'neon-orange',
    },
  ]

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
              <span className="text-white">Report City Issues</span>
              <br />
              <span className="gradient-text">in Seconds</span>
            </h1>

            {/* Subtext */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
              AI-powered reporting using Google Vision, Gemini, and Maps.
              <br className="hidden md:block" />
              Making cities smarter, one report at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/report">
                <Button size="xl" icon={Camera}>
                  Report an Issue
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="xl" icon={Eye}>
                  View Dashboard
                </Button>
              </Link>
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

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Smart Reporting Made Simple
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our AI-powered system handles everything from image analysis to location detection
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full" glow glowColor={feature.color.replace('neon-', '')}>
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}/20 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
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
                Ready to Make Your City Smarter?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of citizens who are already making a difference in their communities.
              </p>
              <Link to="/report">
                <Button size="xl" icon={ChevronRight} iconPosition="right">
                  Start Reporting Now
                </Button>
              </Link>
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
            Built for Hackathon 2024 • Powered by Google Technologies
          </p>
        </div>
      </footer>
    </div>
  )
}
