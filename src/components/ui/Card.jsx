import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  glowColor = 'blue',
  padding = true,
  onClick,
  ...props
}) {
  const glowClasses = {
    blue: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    green: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]',
    orange: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      className={`
        glass rounded-2xl
        ${padding ? 'p-6' : ''}
        ${hover ? 'transition-all duration-300 cursor-pointer' : ''}
        ${glow ? glowClasses[glowColor] : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}
