import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  variant = 'paper',
  padding = true,
  onClick,
  ...props
}) {
  const variants = {
    paper: 'bg-cream border border-cream-muted shadow-paper',
    elevated: 'bg-cream border border-cream-muted shadow-paper-lg',
    slate: 'bg-slate text-cream border border-slate-light',
    outline: 'bg-transparent border-2 border-slate',
    ghost: 'bg-cream-dark/50 border border-cream-muted',
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: '0 12px 32px rgba(26, 35, 50, 0.12)' } : {}}
      className={`
        relative overflow-hidden
        ${variants[variant]}
        ${padding ? 'p-6' : ''}
        ${hover ? 'transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Subtle paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
