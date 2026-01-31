import { motion } from 'framer-motion'
import { Camera, Brain, MapPin, Send } from 'lucide-react'

export default function HowItWorks() {
  const colorMap = {
    'neon-blue': '#00D9FF',
    'neon-purple': '#B026FF',
    'neon-green': '#00FF41',
    'neon-orange': '#FFB700',
  }

  const steps = [
    {
      number: '01',
      icon: Camera,
      title: 'Capture the Issue',
      description: 'Take a photo or upload an image of any city problem - pothole, graffiti, broken light, etc.',
      color: 'neon-blue',
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI Verifies',
      description: 'Google Vision API detects objects. Gemini AI writes an official-quality description automatically.',
      color: 'neon-purple',
    },
    {
      number: '03',
      icon: MapPin,
      title: 'Location Pinned',
      description: 'Automatic geolocation or manual pin marks the exact spot for city crews to find it.',
      color: 'neon-green',
    },
    {
      number: '04',
      icon: Send,
      title: 'Report Routed',
      description: 'Verified report reaches the right city department. Track it from submission to resolution.',
      color: 'neon-orange',
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Report city issues in four simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green transform -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 h-full relative z-10">
                  {/* Step number - positioned to ensure visibility */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-dark-bg flex-shrink-0"
                      style={{ backgroundColor: colorMap[step.color] }}
                    >
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${colorMap[step.color]}20` }}
                  >
                    <step.icon className="w-7 h-7" style={{ color: colorMap[step.color] }} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
