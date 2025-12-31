import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Map as MapIcon, List, Filter, Search, X } from 'lucide-react'
import MapView from '../components/dashboard/MapView'
import IssueList from '../components/dashboard/IssueList'
import IssueDetailModal from '../components/dashboard/IssueDetailModal'
import DashboardStats from '../components/dashboard/DashboardStats'
import { Button, CityImpactPanel } from '../components/ui'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, orderBy } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { isAdmin } from '../utils/userUtils'
import { useNavigate } from 'react-router-dom'

// Issue types for filtering
const issueTypes = [
  'pothole',
  'broken-light',
  'graffiti',
  'flooding',
  'tree',
  'garbage',
  'traffic-sign',
  'other'
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, authLoading] = useAuthState(auth)
  const [viewMode, setViewMode] = useState('map') // 'map' | 'list'
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  // Protect Route
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin(user))) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch Real Data
  const [value, loading, error] = useCollection(
    query(collection(db, 'issues'), orderBy('createdAt', 'desc'))
  );

  const issues = useMemo(() => {
    if (!value) return [];
    return value.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        type: data.manualLabel || 'other',
        // Use AI analysis if available, otherwise use manual label
        aiConfidence: data.aiAnalysis?.confidenceScore || 0,
        aiVerified: data.aiAnalysis?.verified || false,
        aiSummary: data.aiAnalysis?.summary || 'Analyzing...',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      }
    });
  }, [value]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Status filter
      if (filters.status !== 'all' && issue.status !== filters.status) {
        return false
      }
      // Type filter
      if (filters.type !== 'all' && issue.type !== filters.type) {
        return false
      }
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          issue.description?.toLowerCase().includes(searchLower) ||
          issue.location?.address?.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [filters, issues])

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'verified', label: 'Verified (AI)' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'resolved', label: 'Resolved' },
  ]


  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">City Issues Dashboard</h1>
              <p className="text-gray-400 text-sm">
                {filteredIssues.length} issues found {filteredIssues.filter(i => i.aiVerified).length > 0 && `• ${filteredIssues.filter(i => i.aiVerified).length} AI-verified`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-neon-blue/50 focus:outline-none text-white text-sm placeholder-gray-600"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter toggle */}
              <Button
                variant={showFilters ? 'primary' : 'secondary'}
                size="sm"
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="hidden sm:inline">Filters</span>
              </Button>

              {/* View toggle */}
              <div className="flex items-center rounded-lg bg-dark-bg border border-dark-border p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'map'
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-dark-border"
            >
              <div className="flex flex-wrap gap-4">
                {/* Status filter */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-neon-blue/50"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type filter */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Issue Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-neon-blue/50"
                  >
                    <option value="all">All Types</option>
                    {issueTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear filters */}
                {(filters.status !== 'all' || filters.type !== 'all' || filters.search) && (
                  <button
                    onClick={() => setFilters({ status: 'all', type: 'all', search: '' })}
                    className="self-end px-3 py-2 text-sm text-neon-blue hover:text-neon-blue/80"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats */}
      <DashboardStats issues={issues} />

      {/* City Impact Panel */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <CityImpactPanel />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'map' ? (
          <MapView
            issues={filteredIssues}
            onSelectIssue={setSelectedIssue}
          />
        ) : (
          <IssueList
            issues={filteredIssues}
            onSelectIssue={setSelectedIssue}
          />
        )}
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  )
}
