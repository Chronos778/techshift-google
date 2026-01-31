import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebase'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const dropdownRef = useRef(null)
    const [user] = useAuthState(auth)

    // Subscribe to real notifications from Firestore
    useEffect(() => {
        if (!user) {
            setNotifications([])
            return
        }

        const notificationsRef = collection(db, 'notifications')
        const q = query(
            notificationsRef,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                time: formatTime(doc.data().createdAt),
            }))
            setNotifications(notifs)
            setUnreadCount(notifs.filter(n => !n.read).length)
        }, (error) => {
            console.error('Error fetching notifications:', error)
        })

        return () => unsubscribe()
    }, [user])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [user])

    const formatTime = (timestamp) => {
        if (!timestamp) return 'now'
        const now = new Date()
        const date = timestamp.toDate?.() || new Date(timestamp)
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-success" />
            case 'alert': return <AlertTriangle className="w-4 h-4 text-warning" />
            default: return <Info className="w-4 h-4 text-blueprint" />
        }
    }

    if (!user) return null

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-muted hover:text-slate transition-colors hover:bg-cream-dark/50"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-cream border border-cream-muted shadow-paper-lg z-50 overflow-hidden"
                    >
                        <div className="p-3 border-b border-cream-muted flex items-center justify-between">
                            <h3 className="font-display font-semibold text-slate text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-display text-accent hover:text-accent/80"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-muted text-sm font-body">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-3 border-b border-cream-muted/50 hover:bg-cream-dark/30 transition-colors ${!n.read ? 'bg-blueprint/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">{getIcon(n.type)}</div>
                                            <div>
                                                <p className={`text-sm font-body ${!n.read ? 'text-slate font-medium' : 'text-slate-muted'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-slate-muted mt-0.5 line-clamp-2 font-body">
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-slate-muted mt-1 font-body">
                                                    {n.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 border-t border-cream-muted bg-cream-dark/30 text-center">
                            <button className="text-xs font-display text-slate-muted hover:text-accent transition-colors">
                                View All Activity
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
