import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map as MapIcon, List, Filter, Search, X, LayoutGrid, Activity, TrendingUp, Sparkles, RefreshCw } from 'lucide-react'
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
  { id: 'pothole', label: 'Pothole', icon: '🕳️' },
  { id: 'broken-light', label: 'Broken Light', icon: '💡' },
  { id: 'graffiti', label: 'Graffiti', icon: '🎨' },
  { id: 'flooding', label: 'Flooding', icon: '🌊' },
  { id: 'tree', label: 'Tree Issue', icon: '🌳' },
  { id: 'garbage', label: 'Garbage', icon: '🗑️' },
  { id: 'traffic-sign', label: 'Traffic Sign', icon: '🚦' },
  { id: 'other', label: 'Other', icon: '📋' },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

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

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.type !== 'all',
    filters.search !== ''
  ].filter(Boolean).length


  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Header Section */}
      <div className="relative bg-slate overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(#3B7DD8 1px, transparent 1px),
                linear-gradient(90deg, #3B7DD8 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate via-slate to-slate-light" />
        
        {/* Floating Accent Elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/4 w-64 h-64 bg-blueprint/20 rounded-full blur-[80px]"
        />

        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-cream/10 backdrop-blur-sm border border-cream/20">
                <Activity className="w-4 h-4 text-accent" />
                <span className="font-display text-xs font-semibold uppercase tracking-wider text-cream">
                  Admin Dashboard
                </span>
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              variants={itemVariants}
              className="font-display text-4xl md:text-5xl font-bold text-cream tracking-tight mb-4"
            >
              City Issues
              <span className="text-accent"> Command Center</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-cream/70 font-body text-lg max-w-2xl mb-8"
            >
              Monitor, verify, and resolve city infrastructure issues in real-time. 
              AI-powered analysis helps prioritize what matters most.
            </motion.p>

            {/* Quick Stats Row */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 text-cream/80"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="font-display text-sm">
                  <span className="font-bold text-cream">{issues.length}</span> Total Issues
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-display text-sm">
                  <span className="font-bold text-cream">{issues.filter(i => i.aiVerified).length}</span> AI Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="font-display text-sm">
                  <span className="font-bold text-cream">{issues.filter(i => i.status === 'resolved').length}</span> Resolved
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-accent/30 -mb-1 -mr-1" />
      </div>

      {/* Control Bar */}
      <div className="bg-cream border-b border-cream-muted sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Results info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blueprint/10 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-blueprint" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-slate">
                    {filteredIssues.length} Issues
                  </p>
                  <p className="text-xs text-slate-muted font-body">
                    {activeFiltersCount > 0 ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active` : 'Showing all'}
                  </p>
                </div>
              </div>
              
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4 text-blueprint" />
                </motion.div>
              )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by description or location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-11 pr-10 py-3 bg-cream border-2 border-cream-muted focus:border-blueprint text-slate font-display text-sm placeholder-slate-muted transition-colors"
                />
                <AnimatePresence>
                  {filters.search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setFilters({ ...filters, search: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-muted hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter toggle */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={showFilters ? 'primary' : 'secondary'}
                  size="md"
                  icon={Filter}
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-cream text-xs font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* View toggle */}
              <div className="flex items-center border-2 border-cream-muted bg-cream overflow-hidden">
                <motion.button
                  whileHover={{ backgroundColor: viewMode !== 'map' ? 'rgba(59, 125, 216, 0.1)' : undefined }}
                  onClick={() => setViewMode('map')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'map'
                    ? 'bg-slate text-cream'
                    : 'text-slate-muted hover:text-slate'
                    }`}
                >
                  <MapIcon className="w-4 h-4" strokeWidth={2} />
                </motion.button>
                <div className="w-px h-6 bg-cream-muted" />
                <motion.button
                  whileHover={{ backgroundColor: viewMode !== 'list' ? 'rgba(59, 125, 216, 0.1)' : undefined }}
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-300 ${viewMode === 'list'
                    ? 'bg-slate text-cream'
                    : 'text-slate-muted hover:text-slate'
                    }`}
                >
                  <List className="w-4 h-4" strokeWidth={2} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-cream-muted">
                  <div className="flex flex-wrap items-end gap-4">
                    {/* Status filter */}
                    <div className="min-w-[160px]">
                      <label className="block font-display text-xs uppercase tracking-wider text-slate-muted mb-2">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-4 py-3 bg-cream border-2 border-cream-muted text-slate font-display text-sm focus:outline-none focus:border-blueprint transition-colors cursor-pointer"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type filter */}
                    <div className="min-w-[180px]">
                      <label className="block font-display text-xs uppercase tracking-wider text-slate-muted mb-2">
                        Issue Type
                      </label>
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="w-full px-4 py-3 bg-cream border-2 border-cream-muted text-slate font-display text-sm focus:outline-none focus:border-blueprint transition-colors cursor-pointer"
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
                    <AnimatePresence>
                      {activeFiltersCount > 0 && (
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          onClick={() => setFilters({ status: 'all', type: 'all', search: '' })}
                          className="px-4 py-3 font-display text-sm font-semibold text-accent hover:text-accent-hover hover:bg-accent/5 transition-colors"
                        >
                          Clear all filters
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        </AnimatePresence>
        
        {/* Empty state */}
        {filteredIssues.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-cream-dark mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-muted" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate mb-2">No issues found</h3>
            <p className="text-slate-muted font-body mb-6">
              {activeFiltersCount > 0 
                ? "Try adjusting your filters to see more results"
                : "No city issues have been reported yet"}
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="secondary"
                onClick={() => setFilters({ status: 'all', type: 'all', search: '' })}
              >
                Clear all filters
              </Button>
            )}
          </motion.div>
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
