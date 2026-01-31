import { motion } from 'framer-motion'
import { Eye, Sparkles, Map, Flame, Zap, Cloud } from 'lucide-react'

export default function GoogleSection() {
  const googleServices = [
    {
      name: 'Cloud Vision AI',
      description: 'Automatic image analysis and issue detection',
      icon: Eye,
    },
    {
      name: 'Gemini AI',
      description: 'Natural language description generation',
      icon: Sparkles,
    },
    {
      name: 'Google Maps',
      description: 'Precise geolocation and mapping',
      icon: Map,
    },
    {
      name: 'Firebase',
      description: 'Real-time database and storage',
      icon: Flame,
    },
    {
      name: 'Cloud Functions',
      description: 'Serverless backend processing',
      icon: Zap,
    },
    {
      name: 'Google Cloud',
      description: 'Scalable infrastructure',
      icon: Cloud,
    },
  ]

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      
      {/* Decorative topographic lines */}
      <div className="absolute inset-0 topo-lines opacity-30" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Label with architectural line accents */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-accent" />
            <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Infrastructure
            </span>
            <div className="w-12 h-px bg-accent" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate mb-5 tracking-tight leading-[1.1]">
            Built on <span className="text-blueprint">Google Cloud</span>
          </h2>
          <p className="text-slate-muted font-body text-lg max-w-xl mx-auto leading-relaxed">
            Enterprise-grade AI and infrastructure powering every report
          </p>
        </motion.div>

        {/* Services Grid - Editorial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-cream-muted">
          {googleServices.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group"
              >
                <div className="bg-cream p-8 h-full relative overflow-hidden transition-all duration-300 hover:bg-cream-dark/20">
                  {/* Hover accent line */}
                  <div className="absolute top-0 left-0 w-0 h-[2px] bg-blueprint group-hover:w-full transition-all duration-500" />
                  
                  {/* Icon with blueprint aesthetic */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 border-2 border-slate/35 flex items-center justify-center group-hover:border-blueprint transition-colors duration-300">
                      <Icon className="w-6 h-6 text-slate group-hover:text-blueprint transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    {/* Corner marks */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-blueprint/0 group-hover:border-blueprint/60 transition-colors duration-300" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-blueprint/0 group-hover:border-blueprint/60 transition-colors duration-300" />
                  </div>
                  
                  <h3 className="font-display text-base font-semibold text-slate mb-2 tracking-tight group-hover:text-blueprint transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-slate-muted font-body text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Integration Status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate text-cream">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="font-display text-sm font-medium tracking-wide">
                Integration Ready
              </span>
            </div>
            <div className="w-px h-4 bg-cream/20" />
            <span className="font-body text-sm text-cream/70">
              Connect credentials to activate
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
