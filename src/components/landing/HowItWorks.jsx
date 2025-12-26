import { motion } from 'framer-motion'
import { Camera, Brain, MapPin, Send } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Camera,
      title: 'Capture the Issue',
      description: 'Take a photo or upload an image of any city infrastructure problem you encounter.',
      color: 'neon-blue',
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI Analyzes',
      description: 'Google Vision AI identifies the issue type while Gemini generates a detailed description.',
      color: 'neon-purple',
    },
    {
      number: '03',
      icon: MapPin,
      title: 'Location Detected',
      description: 'Your GPS coordinates are captured and reverse-geocoded for precise location.',
      color: 'neon-green',
    },
    {
      number: '04',
      icon: Send,
      title: 'Report Submitted',
      description: 'Your report is sent to the appropriate city department for quick resolution.',
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
                  {/* Step number */}
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-${step.color} flex items-center justify-center text-sm font-bold text-dark-bg`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-${step.color}/20 flex items-center justify-center mb-4`}>
                    <step.icon className={`w-7 h-7 text-${step.color}`} />
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
