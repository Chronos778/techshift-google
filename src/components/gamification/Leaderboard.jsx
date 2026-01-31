import { motion } from 'framer-motion'
import { Trophy, Medal, Star, Shield, Award } from 'lucide-react'
import { Card } from '../ui'
import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

const BadgeIcon = ({ type }) => {
    switch (type) {
        case 'guardian':
            return <Shield className="w-4 h-4 text-blueprint" title="City Guardian" />
        case 'super_citizen':
            return <Star className="w-4 h-4 text-accent" title="Super Citizen" />
        case 'pothole_patrol':
            return <Award className="w-4 h-4 text-warning" title="Pothole Patrol" />
        case 'green_thumb':
            return <Award className="w-4 h-4 text-success" title="Green Thumb" />
        default:
            return null
    }
}

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const usersRef = collection(db, 'users')
                // First try to get users with points field
                const q = query(
                    usersRef,
                    orderBy('points', 'desc'),
                    limit(5)
                )
                const snapshot = await getDocs(q)
                
                if (snapshot.empty) {
                    // If no users with points, calculate from issues
                    console.log('No users found in collection, using demo message')
                    setLeaderboard([])
                } else {
                    const users = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        points: doc.data().points || 0,
                        badges: doc.data().badges || [],
                        avatar: doc.data().photoURL || `https://i.pravatar.cc/150?u=${doc.id}`,
                        name: doc.data().displayName || 'Anonymous',
                    }))
                    setLeaderboard(users)
                }
            } catch (error) {
                // If orderBy fails (no indexed collection), show friendly message
                if (error.message.includes('FAILED_PRECONDITION')) {
                    console.log('Collection not indexed yet, showing empty state')
                    setLeaderboard([])
                } else {
                    console.error('Error fetching leaderboard:', error)
                    setLeaderboard([])
                }
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    return (
        <Card hover={false} className="overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-warning flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-cream" />
                </div>
                <div>
                    <h3 className="font-display text-xl font-bold text-slate">Top Contributors</h3>
                    <p className="text-sm text-slate-muted font-body">Citizens making a difference</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-slate-muted font-body">Loading leaderboard...</p>
                </div>
            ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-cream-muted mx-auto mb-4" />
                    <p className="text-slate font-display font-semibold mb-2">Leaderboard Coming Soon</p>
                    <p className="text-slate-muted font-body text-sm">Submit reports to start earning Impact Points and badges. The top contributors will appear here!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {leaderboard.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-3 bg-cream-dark/30 border border-cream-muted hover:border-accent/30 transition-colors"
                        >
                            {/* Rank */}
                            <div className={`
                                w-8 h-8 flex items-center justify-center font-display font-bold
                                ${index === 0 ? 'text-warning bg-warning/10' : ''}
                                ${index === 1 ? 'text-slate-muted bg-slate/10' : ''}
                                ${index === 2 ? 'text-accent bg-accent/10' : ''}
                                ${index > 2 ? 'text-slate-muted' : ''}
                            `}
                            >
                                {index + 1}
                            </div>

                            {/* Avatar */}
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 border-2 border-cream-muted"
                            />

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-display font-medium text-slate truncate">{user.name}</h4>
                                    {user.badges.map(badge => (
                                        <BadgeIcon key={badge} type={badge} />
                                    ))}
                                </div>
                                <div className="text-xs text-slate-muted font-body">
                                    {user.points} Impact Points
                                </div>
                            </div>

                            {/* Medal for top 3 */}
                            {index < 3 && (
                                <Medal className={`
                                    w-5 h-5
                                    ${index === 0 ? 'text-warning' : ''}
                                    ${index === 1 ? 'text-slate-muted' : ''}
                                    ${index === 2 ? 'text-accent' : ''}
                                `} />
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-cream-muted text-center">
                <button className="font-display text-sm font-semibold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider">
                    View Global Rankings →
                </button>
            </div>
        </Card>
    )
}
