import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Camera, Brain, MapPin, Send } from 'lucide-react'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Capture',
    subtitle: 'Document the Issue',
    description: 'Take a photo or upload an image of any city problem — pothole, graffiti, broken light, fallen tree.',
  },
  {
    number: '02',
    icon: Brain,
    title: 'Analyze',
    subtitle: 'AI Verification',
    description: 'Google Vision detects objects. Gemini AI writes an official-quality description automatically.',
  },
  {
    number: '03',
    icon: MapPin,
    title: 'Locate',
    subtitle: 'Precision Pinned',
    description: 'Automatic geolocation or manual pin marks the exact coordinates for city crews.',
  },
  {
    number: '04',
    icon: Send,
    title: 'Submit',
    subtitle: 'Routed & Tracked',
    description: 'Verified report reaches the right department. Track progress from submission to resolution.',
  },
]

function StepCard({ step, index, isLast }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: false, margin: "-20% 0px -20% 0px" })
  const Icon = step.icon
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Connector line to next step (vertical on mobile, horizontal on desktop) */}
      {!isLast && (
        <>
          {/* Mobile: Vertical line */}
          <div className="lg:hidden absolute left-7 top-full w-px h-8 bg-cream-muted">
            <motion.div
              className="w-full bg-blueprint origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ height: '100%' }}
            />
          </div>
          
          {/* Desktop: Horizontal line */}
          <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-cream-muted -ml-4 -mr-4" style={{ width: 'calc(100% - 3rem)' }}>
            <motion.div
              className="h-full bg-blueprint origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ width: '100%' }}
            />
          </div>
        </>
      )}
      
      {/* Card */}
      <div className={`
        relative bg-cream border border-cream-muted p-8
        transition-all duration-500
        ${isInView ? 'shadow-lg border-blueprint/30' : 'shadow-paper'}
      `}>
        {/* Active indicator line */}
        <motion.div 
          className="absolute top-0 left-0 h-full w-[3px] bg-blueprint origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Step Number Badge */}
        <div className="flex items-start gap-6 mb-6">
          <motion.div 
            className={`
              relative w-14 h-14 flex items-center justify-center 
              font-display text-lg font-bold transition-all duration-500
              ${isInView ? 'bg-blueprint text-cream' : 'bg-cream-dark/50 text-slate-muted'}
            `}
            animate={{ scale: isInView ? 1 : 0.95 }}
          >
            {step.number}
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-blueprint" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-blueprint" />
          </motion.div>
          
          {/* Icon */}
          <motion.div 
            className={`
              w-14 h-14 flex items-center justify-center border-2 transition-all duration-500
              ${isInView ? 'border-accent bg-accent/5' : 'border-cream-muted bg-transparent'}
            `}
            animate={{ rotate: isInView ? 0 : -5 }}
          >
            <Icon 
              className={`w-6 h-6 transition-colors duration-500 ${isInView ? 'text-accent' : 'text-slate-muted'}`} 
              strokeWidth={1.5} 
            />
          </motion.div>
        </div>
        
        {/* Content */}
        <div>
          <motion.p 
            className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-blueprint mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isInView ? 1 : 0.5, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {step.subtitle}
          </motion.p>
          <h3 className="font-display text-2xl font-bold text-slate mb-3 tracking-tight">
            {step.title}
          </h3>
          <p className="text-slate-muted font-body text-sm leading-relaxed">
            {step.description}
          </p>
        </div>
        
        {/* Blueprint corner marks */}
        <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-cream-muted" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-cream-muted" />
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  
  // Transform for the main progress line
  const lineHeight = useTransform(smoothProgress, [0.1, 0.9], ["0%", "100%"])

  return (
    <section ref={containerRef} className="py-32 px-4 relative overflow-hidden bg-cream-dark/20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, transparent 50%, rgba(59, 125, 216, 0.03) 50%, rgba(59, 125, 216, 0.03) 100%)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-accent" />
            <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Process
            </span>
            <div className="w-12 h-px bg-accent" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate mb-5 tracking-tight leading-[1.1]">
            How It Works
          </h2>
          <p className="text-slate-muted font-body text-lg max-w-lg mx-auto leading-relaxed">
            Four steps from observation to resolution
          </p>
        </motion.div>

        {/* Progress Line - Mobile Only */}
        <div className="lg:hidden absolute left-[2.25rem] top-[280px] bottom-[200px] w-[2px] bg-cream-muted">
          <motion.div 
            className="w-full bg-blueprint origin-top"
            style={{ height: lineHeight }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-4 relative">
          {steps.map((step, index) => (
            <StepCard 
              key={step.number} 
              step={step} 
              index={index} 
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
        
        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="font-body text-slate-muted text-sm">
            Ready to report an issue? It takes less than <span className="font-display font-semibold text-slate">60 seconds</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
