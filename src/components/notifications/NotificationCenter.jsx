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
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'alert': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
            default: return <Info className="w-4 h-4 text-blue-500" />
        }
    }

    if (!user) return null

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-dark-card border border-dark-border rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-3 border-b border-dark-border flex items-center justify-between">
                            <h3 className="font-semibold text-white text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-neon-blue hover:text-neon-cyan"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-3 border-b border-dark-border/50 hover:bg-white/5 transition-colors ${!n.read ? 'bg-white/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">{getIcon(n.type)}</div>
                                            <div>
                                                <p className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-gray-600 mt-1">
                                                    {n.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-2 border-t border-dark-border bg-dark-bg/50 text-center">
                            <button className="text-xs text-gray-400 hover:text-white transition-colors">
                                View All Activity
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
