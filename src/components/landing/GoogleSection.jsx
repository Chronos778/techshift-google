import { motion } from 'framer-motion'

export default function GoogleSection() {
  const googleServices = [
    {
      name: 'Cloud Vision AI',
      description: 'Automatic image analysis and issue detection',
      icon: '👁️',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Gemini AI',
      description: 'Natural language description generation',
      icon: '✨',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Google Maps',
      description: 'Precise geolocation and mapping',
      icon: '🗺️',
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Firebase',
      description: 'Real-time database and storage',
      icon: '🔥',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      name: 'Cloud Functions',
      description: 'Serverless backend processing',
      icon: '⚡',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      name: 'Google Cloud',
      description: 'Scalable infrastructure',
      icon: '☁️',
      color: 'from-gray-500 to-slate-500',
    },
  ]

  return (
    <section className="py-20 px-4 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powered by <span className="gradient-text">Google</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built on Google's cutting-edge AI and cloud technologies for maximum reliability and intelligence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {googleServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full transition-all duration-300 hover:border-white/20">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl shrink-0`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-neon-blue transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Integration-ready • Connect your Google Cloud credentials to go live
          </div>
        </motion.div>
      </div>
    </section>
  )
}
