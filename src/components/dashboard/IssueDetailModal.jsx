import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, CheckCircle, AlertCircle, Brain, Trash2, Clock } from 'lucide-react'
import { IssueTypeTag, StatusBadge } from '../ui'
import { useState } from 'react'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'

export default function IssueDetailModal({ issue, isOpen, onClose }) {
  const [currentStatus, setCurrentStatus] = useState(issue?.status || 'pending')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const handleStatusUpdate = async () => {
    setIsUpdating(true)
    setUpdateError(null)

    try {
      const issueRef = doc(db, 'issues', issue.id)
      const now = new Date()

      console.log(`Updating issue ${issue.id} status to: ${currentStatus}`)

      await updateDoc(issueRef, {
        status: currentStatus,
        resolved: currentStatus === 'resolved',
        updatedAt: now,
      })

      console.log('Status updated successfully')
      setIsUpdating(false)
      
      // Close modal after successful update
      setTimeout(() => onClose(), 500)
    } catch (error) {
      console.error('Error updating issue:', error)
      setUpdateError(error.message)
      setIsUpdating(false)
    }
  }

  const handleDeleteIssue = async () => {
    setIsDeleting(true)
    setUpdateError(null)

    try {
      const issueRef = doc(db, 'issues', issue.id)
      console.log(`Deleting issue ${issue.id}`)
      
      await deleteDoc(issueRef)
      
      console.log('Issue deleted successfully')
      setIsDeleting(false)
      onClose()
    } catch (error) {
      console.error('Error deleting issue:', error)
      setUpdateError(error.message)
      setIsDeleting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            drag={!isMobile}
            dragMomentum={false}
            dragElastic={0.1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:w-full md:max-w-3xl md:h-auto z-50 px-0 md:px-4"
            style={{ maxHeight: '100vh' }}
          >
            <div className="bg-cream border border-cream-muted shadow-paper-lg overflow-hidden max-h-[100vh] overflow-y-auto w-full md:flex md:flex-col">
              {/* Header with image */}
              <div className="relative h-64">
                <img
                  src={issue.imageUrl}
                  alt={issue.type}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-transparent" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-cream/80 backdrop-blur-sm text-slate hover:bg-cream transition-colors border border-cream-muted"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Issue info overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3 mb-2">
                    <IssueTypeTag type={issue.type} size="lg" />
                    <StatusBadge status={issue.status} size="lg" />
                  </div>
                  <p className="text-sm text-slate-muted font-display">
                    Report #{issue.id.split('_')[1]}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-display text-sm text-slate-muted mb-2 uppercase tracking-wider">
                    {issue.aiAnalysis?.verified ? '✅ AI-Verified Description' : '🤖 AI Analysis'}
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${issue.aiAnalysis?.verified ? 'bg-success/20' : 'bg-accent/20'}`}>
                      <Brain className={`w-4 h-4 ${issue.aiAnalysis?.verified ? 'text-success' : 'text-accent'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate font-body text-sm leading-relaxed">
                        {issue.aiAnalysis?.summary || issue.description || 'Analyzing issue...'}
                      </p>
                      <div className="mt-4 space-y-3">
                        {/* Confidence Score */}
                        {issue.aiAnalysis?.confidenceScore !== undefined && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-muted font-display uppercase tracking-wider">AI Confidence</span>
                              <span className="text-sm font-display font-bold text-blueprint">{(issue.aiAnalysis.confidenceScore * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-cream-muted h-1.5">
                              <div 
                                className="bg-blueprint h-full transition-all"
                                style={{ width: `${Math.min(100, issue.aiAnalysis.confidenceScore * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Detected Labels Grid */}
                        {issue.aiAnalysis?.detectedLabels && issue.aiAnalysis.detectedLabels.length > 0 && (
                          <div>
                            <span className="text-xs text-slate-muted font-display uppercase tracking-wider block mb-2">Detected Objects</span>
                            <div className="flex gap-1 flex-wrap">
                              {issue.aiAnalysis.detectedLabels.slice(0, 5).map((label, i) => (
                                <span key={i} className="px-3 py-1.5 bg-blueprint/10 text-blueprint text-xs font-display font-medium border border-blueprint/30">
                                  {label.description || label}
                                  {label.confidence && ` (${(label.confidence * 100).toFixed(0)}%)`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Priority and Issue Type */}
                        {issue.aiAnalysis?.priority && (
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <span className="text-xs text-slate-muted font-display uppercase tracking-wider block mb-1">Priority</span>
                              <span className={`text-xs font-display font-semibold px-2 py-1 ${
                                issue.aiAnalysis.priority === 'high' ? 'bg-danger/10 text-danger' :
                                issue.aiAnalysis.priority === 'medium' ? 'bg-warning/10 text-warning' :
                                'bg-success/10 text-success'
                              }`}>
                                {issue.aiAnalysis.priority.charAt(0).toUpperCase() + issue.aiAnalysis.priority.slice(1)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {issue.location && (
                  <div>
                    <h3 className="font-display text-sm text-slate-muted mb-2 uppercase tracking-wider">Location</h3>
                    <div className="flex items-start gap-3 p-4 bg-cream-dark/30 border border-cream-muted">
                      <MapPin className="w-5 h-5 text-success shrink-0" />
                      <div>
                        <p className="text-slate font-body">{issue.location.address || 'Unknown location'}</p>
                        <p className="text-xs text-slate-muted font-mono mt-1">
                          {issue.location.lat?.toFixed(6) || '0.000000'}, {issue.location.lng?.toFixed(6) || '0.000000'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Issue Status Toggle */}
                <div className="bg-cream-dark/30 p-6 border border-cream-muted">
                  <div className="mb-4">
                    <h3 className="font-display text-lg font-semibold text-slate mb-1">Issue Status</h3>
                    <p className="text-sm text-slate-muted font-body">Update the current status of this issue</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      onClick={() => setCurrentStatus('pending')}
                      className={`px-3 md:px-4 py-3 md:py-2 font-display font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base min-h-[44px] md:min-h-auto ${
                        currentStatus === 'pending'
                          ? 'bg-warning text-cream'
                          : 'bg-cream border border-cream-muted text-slate-muted hover:border-warning/50'
                      }`}
                      disabled={isUpdating}
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Pending</span>
                    </button>
                    <button
                      onClick={() => setCurrentStatus('in-progress')}
                      className={`px-3 md:px-4 py-3 md:py-2 font-display font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base min-h-[44px] md:min-h-auto ${
                        currentStatus === 'in-progress'
                          ? 'bg-accent text-cream'
                          : 'bg-cream border border-cream-muted text-slate-muted hover:border-accent/50'
                      }`}
                      disabled={isUpdating}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">In Progress</span>
                    </button>
                    <button
                      onClick={() => setCurrentStatus('resolved')}
                      className={`px-3 md:px-4 py-3 md:py-2 font-display font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base min-h-[44px] md:min-h-auto ${
                        currentStatus === 'resolved'
                          ? 'bg-success text-cream'
                          : 'bg-cream border border-cream-muted text-slate-muted hover:border-success/50'
                      }`}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Complete</span>
                    </button>
                  </div>

                  {updateError && (
                    <div className="mb-3 text-xs text-danger bg-danger/10 p-2 font-body">
                      Error: {updateError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating || currentStatus === issue?.status}
                      className={`py-2 font-display font-semibold transition-colors ${
                        isUpdating || currentStatus === issue?.status
                          ? 'bg-cream-muted text-slate-muted cursor-not-allowed'
                          : 'bg-blueprint text-cream hover:bg-blueprint/90'
                      }`}
                    >
                      {isUpdating ? 'Saving...' : 'Save Status'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isUpdating || isDeleting}
                      className="py-2 font-display font-semibold transition-colors bg-danger text-cream hover:bg-danger/90 disabled:bg-cream-muted disabled:text-slate-muted disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Issue
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-slate/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-cream p-6 max-w-md w-full border-2 border-danger shadow-paper-lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-danger/10 flex items-center justify-center">
                          <Trash2 className="w-6 h-6 text-danger" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-slate">Delete Issue?</h3>
                          <p className="text-sm text-slate-muted font-body">This action cannot be undone.</p>
                        </div>
                      </div>
                      <p className="text-slate font-body mb-6">
                        Are you sure you want to permanently delete this issue? All data including images and AI analysis will be removed.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="flex-1 py-2 font-display font-semibold bg-cream border border-cream-muted text-slate hover:bg-cream-dark transition-colors disabled:bg-cream-muted disabled:text-slate-muted disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteIssue}
                          disabled={isDeleting}
                          className="flex-1 py-2 font-display font-semibold bg-danger text-cream hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete Forever'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-cream-muted">
                  <div className="flex items-center gap-2 text-slate-muted text-sm font-body">
                    <Calendar className="w-4 h-4" />
                    Reported on {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-muted font-body">Reported by:</span>
                    <span className="text-sm text-slate font-display font-medium">{issue.reportedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
