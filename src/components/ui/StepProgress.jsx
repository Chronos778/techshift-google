import { motion } from 'framer-motion'
import { Camera, Brain, CheckCircle, Send, Check } from 'lucide-react'

const steps = [
  { id: 1, name: 'Capture', icon: Camera, description: 'Upload image' },
  { id: 2, name: 'Analyze', icon: Brain, description: 'AI detection' },
  { id: 3, name: 'Confirm', icon: CheckCircle, description: 'Review details' },
  { id: 4, name: 'Submit', icon: Send, description: 'Send report' },
]

export default function StepProgress({ currentStep, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {/* Step counter */}
      <div className="text-center mb-4">
        <motion.span
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-400"
        >
          Step <span className="text-neon-blue font-semibold">{currentStep}</span> of {steps.length}
        </motion.span>
      </div>

      {/* Progress bar container */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-dark-border rounded-full" />
        
        {/* Animated progress fill */}
        <motion.div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue rounded-full"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
          }}
        />

        {/* Glowing particle effect on progress */}
        <motion.div
          className="absolute top-5 h-3 w-3 rounded-full bg-neon-blue"
          initial={{ left: '0%' }}
          animate={{ 
            left: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            boxShadow: '0 0 15px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.4)',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            const isUpcoming = step.id > currentStep
            const Icon = step.icon

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step circle */}
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Glow ring for current step */}
                  {isCurrent && (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.2, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-neon-blue"
                      style={{ filter: 'blur(8px)' }}
                    />
                  )}
                  
                  <div
                    className={`
                      relative w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300 z-10 border-2
                      ${isCompleted 
                        ? 'bg-neon-blue border-neon-blue text-dark-bg' 
                        : isCurrent 
                          ? 'bg-dark-bg border-neon-blue text-neon-blue' 
                          : 'bg-dark-card border-dark-border text-gray-500'
                      }
                    `}
                    style={isCurrent ? {
                      boxShadow: '0 0 25px rgba(0, 212, 255, 0.4)',
                    } : {}}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                </motion.div>

                {/* Step label */}
                <motion.div
                  animate={{ opacity: isCurrent ? 1 : 0.6 }}
                  className="mt-3 text-center"
                >
                  <p className={`text-sm font-medium ${isCurrent ? 'text-neon-blue' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
