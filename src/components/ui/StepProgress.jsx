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
      <div className="text-center mb-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-accent text-cream font-display font-bold flex items-center justify-center">
            {currentStep}
          </div>
          <span className="font-display text-sm uppercase tracking-wider text-slate-muted">
            of {steps.length} steps
          </span>
        </motion.div>
      </div>

      {/* Progress bar container */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-cream-muted" />
        
        {/* Animated progress fill */}
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-accent"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
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
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div
                    className={`
                      relative w-12 h-12 flex items-center justify-center
                      transition-all duration-300 z-10 border-2
                      ${isCompleted 
                        ? 'bg-accent border-accent text-cream' 
                        : isCurrent 
                          ? 'bg-cream border-accent text-accent' 
                          : 'bg-cream-dark border-cream-muted text-slate-muted'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    )}
                  </div>
                </motion.div>

                {/* Step label */}
                <motion.div
                  animate={{ opacity: isCurrent ? 1 : 0.7 }}
                  className="mt-4 text-center"
                >
                  <p className={`font-display text-sm font-semibold uppercase tracking-wide ${isCurrent ? 'text-accent' : isCompleted ? 'text-slate' : 'text-slate-muted'}`}>
                    {step.name}
                  </p>
                  <p className="font-body text-xs text-slate-muted mt-1 hidden sm:block">
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
