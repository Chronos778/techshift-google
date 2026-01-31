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
    <div className="min-h-screen pt-20 bg-cream">
      {/* Header */}
      <div className="bg-cream border-b border-cream-muted sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate tracking-tight">City Issues Dashboard</h1>
              <p className="text-slate-muted font-body text-sm mt-1">
                {filteredIssues.length} issues found {filteredIssues.filter(i => i.aiVerified).length > 0 && `• ${filteredIssues.filter(i => i.aiVerified).length} AI-verified`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border-2 border-cream-muted focus:border-accent text-slate font-display text-sm placeholder-slate-muted"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted hover:text-accent transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
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
              <div className="flex items-center border-2 border-cream-muted bg-cream">
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2.5 transition-colors ${viewMode === 'map'
                    ? 'bg-accent text-cream'
                    : 'text-slate-muted hover:text-slate'
                    }`}
                >
                  <MapIcon className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list'
                    ? 'bg-accent text-cream'
                    : 'text-slate-muted hover:text-slate'
                    }`}
                >
                  <List className="w-4 h-4" strokeWidth={2} />
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
              className="mt-4 pt-4 border-t border-cream-muted"
            >
              <div className="flex flex-wrap gap-4">
                {/* Status filter */}
                <div>
                  <label className="block font-display text-xs uppercase tracking-wider text-slate-muted mb-1.5">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-2.5 bg-cream border-2 border-cream-muted text-slate font-display text-sm focus:outline-none focus:border-accent"
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
                  <label className="block font-display text-xs uppercase tracking-wider text-slate-muted mb-1.5">Issue Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-3 py-2.5 bg-cream border-2 border-cream-muted text-slate font-display text-sm focus:outline-none focus:border-accent"
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
                    className="self-end px-3 py-2 font-display text-sm font-medium text-accent hover:text-accent-hover transition-colors"
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
