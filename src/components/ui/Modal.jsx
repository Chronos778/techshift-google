import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useCallback } from 'react'

// Animation variants for consistent, refined motion
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn', delay: 0.1 }
  }
}

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.96,
    y: 24
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96,
    y: 16,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: 0.05 }
  }
}

const footerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut', delay: 0.1 }
  }
}

// Size configurations
const sizeConfig = {
  sm: { width: 'max-w-md', padding: 'p-5' },
  md: { width: 'max-w-lg', padding: 'p-6' },
  lg: { width: 'max-w-2xl', padding: 'p-6' },
  xl: { width: 'max-w-4xl', padding: 'p-8' },
  full: { width: 'max-w-6xl', padding: 'p-8' },
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
}) {
  const { width, padding } = sizeConfig[size] || sizeConfig.md

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose()
    }
  }, [onClose, closeOnEscape])

  // Lock body scroll and add escape listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, handleEscape])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-slate/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full ${width} mx-4 ${className}`}
          >
            {/* Modal Card - Paper aesthetic */}
            <div className="relative bg-cream border border-cream-muted rounded-xl shadow-lg overflow-hidden">
              {/* Subtle paper texture overlay */}
              <div 
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

              {/* Header */}
              {(title || showCloseButton) && (
                <motion.header 
                  variants={headerVariants}
                  className="relative flex items-start justify-between gap-4 px-6 py-5 border-b border-cream-muted/80"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Optional Icon */}
                    {Icon && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blueprint/15 border border-blueprint/40 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blueprint" />
                      </div>
                    )}
                    
                    {/* Title & Subtitle */}
                    <div className="min-w-0">
                      {title && (
                        <h2 
                          id="modal-title"
                          className="font-display text-lg font-semibold text-slate tracking-tight truncate"
                        >
                          {title}
                        </h2>
                      )}
                      {subtitle && (
                        <p className="mt-0.5 text-sm text-slate-muted font-body">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Close Button */}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 p-2 -mr-2 -mt-1 rounded-lg text-slate-muted hover:text-slate hover:bg-cream-dark/50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blueprint/40"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" strokeWidth={2} />
                    </motion.button>
                  )}
                </motion.header>
              )}

              {/* Content Area */}
              <motion.div 
                variants={contentVariants}
                className={`relative ${padding} max-h-[65vh] overflow-y-auto`}
              >
                {/* Blueprint corner marks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-blueprint/40 rounded-tl-sm" />
                <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-blueprint/40 rounded-tr-sm" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-blueprint/40 rounded-bl-sm" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-blueprint/40 rounded-br-sm" />
                
                {/* Main content */}
                <div className="relative text-slate font-body">
                  {children}
                </div>
              </motion.div>

              {/* Footer - Optional */}
              {footer && (
                <motion.footer 
                  variants={footerVariants}
                  className="relative px-6 py-4 border-t border-cream-muted/80 bg-cream-dark/20"
                >
                  {footer}
                </motion.footer>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Compound components for flexible composition
Modal.Header = function ModalHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

Modal.Title = function ModalTitle({ children, className = '' }) {
  return (
    <h3 className={`font-display text-xl font-semibold text-slate tracking-tight ${className}`}>
      {children}
    </h3>
  )
}

Modal.Description = function ModalDescription({ children, className = '' }) {
  return (
    <p className={`text-slate-muted font-body leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

Modal.Section = function ModalSection({ title, children, className = '' }) {
  return (
    <div className={`py-4 first:pt-0 last:pb-0 ${className}`}>
      {title && (
        <h4 className="font-display text-sm font-semibold text-slate uppercase tracking-wide mb-3">
          {title}
        </h4>
      )}
      {children}
    </div>
  )
}

Modal.Divider = function ModalDivider() {
  return (
    <div className="my-4 h-px bg-cream-muted" />
  )
}

Modal.Actions = function ModalActions({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  )
}
