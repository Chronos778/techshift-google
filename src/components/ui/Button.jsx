import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white glow-blue hover:opacity-90',
  secondary: 'bg-dark-card border border-dark-border text-white hover:border-neon-blue/50',
  outline: 'bg-transparent border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10',
  ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-dark-border/50',
  danger: 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
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
        inline-flex items-center justify-center gap-2 rounded-lg font-semibold
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 spinner" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  )
}
