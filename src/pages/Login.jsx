import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { LogIn, MapPin, Shield, Sparkles, ArrowRight, Zap, Users, CheckCircle2 } from 'lucide-react';
import { isAdmin } from '../utils/userUtils';

// Premium animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.3,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
};

const floatVariants = {
    animate: {
        y: [0, -15, 0],
        rotate: [0, 2, -2, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const Login = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (isAdmin(user.user)) {
                navigate('/dashboard');
            } else {
                navigate('/report');
            }
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Rich gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream-dark to-cream" />
            
            {/* Animated mesh gradient */}
            <motion.div
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 80%, rgba(232, 77, 28, 0.08) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 20%, rgba(232, 77, 28, 0.08) 0%, transparent 50%)',
                        'radial-gradient(circle at 40% 40%, rgba(232, 77, 28, 0.08) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 80%, rgba(232, 77, 28, 0.08) 0%, transparent 50%)',
                    ]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            />
            
            {/* Blueprint grid - more visible */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(#3B7DD8 1.5px, transparent 1.5px),
                        linear-gradient(90deg, #3B7DD8 1.5px, transparent 1.5px)
                    `,
                    backgroundSize: '60px 60px',
                    opacity: 0.15,
                    maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 70%)',
                }}
            />
            
            {/* Premium floating orbs */}
            <motion.div
                animate={{ 
                    scale: [1, 1.3, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-accent/15 to-accent/5 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blueprint/15 to-blueprint/5 rounded-full blur-[80px]"
            />
            
            {/* Floating geometric shapes */}
            <motion.div
                variants={floatVariants}
                animate="animate"
                className="absolute top-20 left-[15%] w-16 h-16 border-2 border-accent/40 rotate-45"
            />
            <motion.div
                variants={floatVariants}
                animate="animate"
                style={{ animationDelay: '2s' }}
                className="absolute bottom-32 right-[10%] w-24 h-24 border-2 border-blueprint/40"
            />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/3 right-[8%] w-20 h-20 border-2 border-slate/20"
            />
            
            {/* Corner frames - more prominent */}
            <motion.div 
                initial={{ opacity: 0, x: -30, y: -30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-12 left-12 w-40 h-40 border-t-2 border-l-2 border-slate/40"
            />
            <motion.div 
                initial={{ opacity: 0, x: 30, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-12 right-12 w-40 h-40 border-b-2 border-r-2 border-slate/40"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-lg"
            >
                {/* Card with premium layered design */}
                <div className="relative">
                    {/* Background shadow layer */}
                    <div className="absolute -inset-1 bg-slate/5 blur-xl" />
                    
                    {/* Outer geometric frame */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute -inset-6 border border-slate/25"
                    />
                    
                    {/* Animated corner accents */}
                    {[
                        { pos: '-top-6 -left-6', border: 'border-t-2 border-l-2', delay: 0.4 },
                        { pos: '-top-6 -right-6', border: 'border-t-2 border-r-2', delay: 0.5 },
                        { pos: '-bottom-6 -left-6', border: 'border-b-2 border-l-2', delay: 0.6 },
                        { pos: '-bottom-6 -right-6', border: 'border-b-2 border-r-2', delay: 0.7 },
                    ].map((corner, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: corner.delay, type: 'spring', stiffness: 200 }}
                            className={`absolute ${corner.pos} w-10 h-10 ${corner.border} border-accent`}
                        />
                    ))}

                    <motion.div 
                        variants={itemVariants}
                        className="bg-cream/95 backdrop-blur-xl border border-cream-muted shadow-2xl p-10 md:p-12 relative overflow-hidden"
                    >
                        {/* Top gradient accent */}
                        <motion.div 
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent to-blueprint origin-left"
                        />
                        
                        {/* Subtle pattern overlay */}
                        <div 
                            className="absolute inset-0 opacity-[0.02] pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A2332' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />
                        
                        {/* Logo with animation */}
                        <motion.div variants={itemVariants} className="flex justify-center mb-10">
                            <div className="flex items-center gap-4">
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative w-16 h-16 bg-slate flex items-center justify-center shadow-xl"
                                >
                                    <MapPin className="w-8 h-8 text-cream" strokeWidth={2} />
                                    {/* Pulse ring */}
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 border-2 border-accent"
                                    />
                                </motion.div>
                                <div>
                                    <span className="font-display font-bold text-3xl text-slate tracking-tight">SmartCity</span>
                                    <span className="block text-xs font-display uppercase tracking-[0.3em] text-accent font-semibold">
                                        Reporter
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center mb-10">
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate mb-4 tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="font-body text-slate-muted text-lg leading-relaxed max-w-sm mx-auto">
                                Sign in to report issues and track city improvements in real-time.
                            </p>
                        </motion.div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="mb-8 p-4 bg-danger/10 border-l-4 border-danger text-danger font-display text-sm"
                            >
                                {error.message}
                            </motion.div>
                        )}

                        <motion.button
                            variants={itemVariants}
                            onClick={() => signInWithGoogle()}
                            disabled={loading}
                            whileHover={{ scale: 1.02, y: -3 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full group relative flex items-center justify-center gap-4 px-8 py-5 bg-slate text-cream font-display font-bold text-lg uppercase tracking-wider hover:bg-slate-light transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden"
                        >
                            {/* Animated gradient background */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-slate-light via-slate to-slate-light"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                style={{ opacity: 0.3 }}
                            />
                            
                            {/* Shine sweep effect */}
                            <motion.div
                                initial={{ x: '-100%', opacity: 0 }}
                                whileHover={{ x: '200%', opacity: 1 }}
                                transition={{ duration: 0.7 }}
                                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />
                            
                            <div className="relative w-6 h-6">
                                <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <span className="relative">
                                {loading ? 'Signing in...' : 'Continue with Google'}
                            </span>
                            <motion.div
                                animate={{ x: loading ? 0 : [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <ArrowRight className="w-5 h-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                            </motion.div>
                        </motion.button>

                        {/* Premium features list */}
                        <motion.div variants={itemVariants} className="mt-10 grid grid-cols-2 gap-4">
                            {[
                                { icon: Shield, text: 'Secure Auth', color: 'text-success' },
                                { icon: Sparkles, text: 'AI-Powered', color: 'text-accent' },
                                { icon: Zap, text: 'Real-time', color: 'text-warning' },
                                { icon: Users, text: 'Community', color: 'text-blueprint' },
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i} 
                                    className="flex items-center gap-3 p-3 bg-cream-dark/50 hover:bg-cream-dark transition-colors duration-300"
                                    whileHover={{ x: 3 }}
                                >
                                    <div className={`w-9 h-9 bg-cream flex items-center justify-center shadow-sm`}>
                                        <feature.icon className={`w-4 h-4 ${feature.color}`} strokeWidth={2.5} />
                                    </div>
                                    <span className="font-display text-sm font-medium text-slate">{feature.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Stats row */}
                        <motion.div 
                            variants={itemVariants} 
                            className="mt-8 pt-8 border-t border-cream-muted grid grid-cols-3 gap-4 text-center"
                        >
                            {[
                                { value: '10K+', label: 'Reports' },
                                { value: '500+', label: 'Fixed' },
                                { value: '4.9★', label: 'Rating' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="font-display text-2xl font-bold text-slate">{stat.value}</div>
                                    <div className="font-body text-xs text-slate-muted uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.p variants={itemVariants} className="text-center font-body text-sm text-slate-muted mt-8">
                            By signing in, you agree to help make your city better.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
