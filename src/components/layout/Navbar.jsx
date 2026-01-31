import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { MapPin, Menu, X, LogOut, User, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase'
import { isAdmin } from '../../utils/userUtils'
import NotificationCenter from '../notifications/NotificationCenter'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, loading] = useAuthState(auth)
  const [scrolled, setScrolled] = useState(false)
  
  const { scrollY } = useScroll()
  
  // Track scroll for navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'Report Issue' },
  ]

  if (user && isAdmin(user)) {
    navLinks.push({ path: '/dashboard', label: 'Dashboard' })
  }


  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-cream/98 backdrop-blur-lg shadow-md border-b border-cream-muted' 
          : 'bg-cream/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-slate flex items-center justify-center group-hover:bg-accent transition-colors duration-300 shadow-md">
                <MapPin className="w-5 h-5 text-cream" strokeWidth={2.5} />
              </div>
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-slate tracking-tight">
                SmartCity
              </span>
              <span className="block text-[10px] font-display uppercase tracking-[0.2em] text-slate-muted -mt-1">
                Reporter
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 font-display text-sm font-medium uppercase tracking-wide transition-colors ${location.pathname === link.path
                  ? 'text-accent'
                  : 'text-slate-muted hover:text-slate'
                  }`}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationCenter />
                <div className="flex items-center gap-2 text-sm font-display text-slate-muted">
                  <User className="w-4 h-4" strokeWidth={2} />
                  <span className="max-w-[120px] truncate">{user.displayName || user.email}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-slate-muted hover:text-accent transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 font-display text-sm font-medium uppercase tracking-wide text-slate-muted hover:text-slate transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link to="/report">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-cream font-display text-sm font-semibold uppercase tracking-wide hover:bg-accent-hover transition-colors group shadow-md hover:shadow-lg relative overflow-hidden"
              >
                {/* Shine effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
                <span className="relative">Report Now</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-slate hover:text-accent transition-colors"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-cream border-t border-cream-muted overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-4 py-4 space-y-1"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 font-display text-sm font-medium uppercase tracking-wide transition-colors ${location.pathname === link.path
                      ? 'text-accent bg-accent/5'
                      : 'text-slate-muted hover:text-slate hover:bg-cream-dark'
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  to="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-accent text-cream font-display text-sm font-semibold uppercase tracking-wide mt-4"
                >
                  Report Now
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
