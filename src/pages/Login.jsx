import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { isAdmin } from '../utils/userUtils';

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
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-neon-cyan/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-glass-dark border border-white/10 p-8 rounded-2xl w-full max-w-md backdrop-blur-xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">
                        Sign in to report issues and track city improvements.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {error.message}
                    </div>
                )}

                <button
                    onClick={() => signInWithGoogle()}
                    disabled={loading}
                    className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
                >
                    <div className="relative w-6 h-6">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </div>
                    <span className="font-medium text-white group-hover:text-neon-cyan transition-colors">
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                    </span>
                    <div className="absolute inset-0 border border-white/0 group-hover:border-neon-cyan/30 rounded-xl transition-all duration-300" />
                </button>
            </motion.div>
        </div>
    );
};

export default Login;
