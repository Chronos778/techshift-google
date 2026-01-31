import { motion } from 'framer-motion'

const variants = {
  primary: `
    bg-accent text-cream font-display font-semibold uppercase tracking-wide
    hover:bg-accent-hover shadow-md hover:shadow-lg
    border-2 border-accent hover:border-accent-hover
  `,
  secondary: `
    bg-cream border-2 border-slate text-slate font-display font-semibold uppercase tracking-wide
    hover:bg-slate hover:text-cream hover:border-slate
  `,
  outline: `
    bg-transparent border-2 border-accent text-accent font-display font-semibold uppercase tracking-wide
    hover:bg-accent hover:text-cream
  `,
  ghost: `
    bg-transparent text-slate-muted font-display font-medium
    hover:text-slate hover:bg-cream-dark
  `,
  danger: `
    bg-danger/10 border-2 border-danger text-danger font-display font-semibold uppercase tracking-wide
    hover:bg-danger hover:text-cream
  `,
  dark: `
    bg-slate text-cream font-display font-semibold uppercase tracking-wide
    hover:bg-slate-light border-2 border-slate hover:border-slate-light
  `,
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
  xl: 'px-8 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2.5
        transition-all duration-200 
        disabled:cursor-not-allowed disabled:bg-slate-muted disabled:border-slate-muted disabled:text-cream/80 disabled:shadow-none
        relative overflow-hidden
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {/* Shine effect on hover */}
      <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      
      {loading ? (
        <>
          <div className="w-4 h-4 spinner" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" strokeWidth={2.5} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" strokeWidth={2.5} />}
        </>
      )}
    </motion.button>
  )
}
