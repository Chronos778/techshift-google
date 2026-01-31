import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Eye, Sparkles, Lightbulb, Edit3, Check, AlertCircle } from 'lucide-react'
import { IssueTypeTag } from './index'

export default function AIAnalysisPanel({
  isAnalyzing = false,
  analysisResult = null,
  description = '',
  onDescriptionChange,
  className = '',
}) {
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState(description)
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    setEditedDescription(description)
  }, [description])

  // Pulse animation trigger
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => setPulseKey(k => k + 1), 2000)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  const handleSaveDescription = () => {
    onDescriptionChange?.(editedDescription)
    setIsEditingDescription(false)
  }

  // TODO: Vision API result will populate analysisResult
  // TODO: Gemini summary will populate reasoning and description

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Paper card */}
      <div 
        className="relative p-6 bg-cream border border-cream-muted shadow-paper"
      >
        {/* Animated border glow during analysis */}
        {isAnalyzing && (
          <motion.div
            key={pulseKey}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              border: '2px solid rgba(59, 125, 216, 0.5)',
              boxShadow: '0 0 20px rgba(59, 125, 216, 0.2)',
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <motion.div
              animate={isAnalyzing ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: isAnalyzing ? Infinity : 0, ease: 'linear' }}
              className="w-10 h-10 bg-blueprint/10 flex items-center justify-center"
            >
              <Brain className="w-5 h-5 text-blueprint" />
            </motion.div>
            {isAnalyzing && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-blueprint/30"
              />
            )}
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-slate">AI Analysis</h3>
            <p className="text-xs text-slate-muted font-body">
              {isAnalyzing ? 'Processing...' : 'Analysis complete'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Analysis stages */}
              {[
                { label: 'Scanning image...', icon: Eye, delay: 0 },
                { label: 'Detecting objects...', icon: Brain, delay: 0.5 },
                { label: 'Generating insights...', icon: Sparkles, delay: 1 },
              ].map((stage, index) => (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stage.delay }}
                  className="flex items-center gap-3 p-3 bg-cream-dark/50 border border-cream-muted"
                >
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: stage.delay }}
                  >
                    <stage.icon className="w-4 h-4 text-blueprint" />
                  </motion.div>
                  <span className="text-sm text-slate font-body">{stage.label}</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="ml-auto w-4 h-4 border-2 border-blueprint/30 border-t-blueprint rounded-full"
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {/* Detected Issue Section */}
              <div className="p-4 bg-cream-dark/30 border border-cream-muted">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-blueprint" />
                  <span className="font-display text-sm font-medium text-slate-muted uppercase tracking-wider">Detected Issue</span>
                </div>
                <div className="flex items-center justify-between">
                  <IssueTypeTag type={analysisResult?.issueType || 'pothole'} size="lg" />
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-blueprint">
                      {((analysisResult?.confidence || 0.89) * 100).toFixed(0)}%
                    </div>
                    <div className="font-display text-xs text-slate-muted uppercase tracking-wider">Confidence</div>
                  </div>
                </div>
                
                {/* Confidence bar */}
                <div className="mt-3 h-2 bg-cream-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(analysisResult?.confidence || 0.89) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-blueprint to-accent"
                  />
                </div>
              </div>

              {/* AI Reasoning Section */}
              <div className="p-4 bg-cream-dark/30 border border-cream-muted">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <span className="font-display text-sm font-medium text-slate-muted uppercase tracking-wider">AI Reasoning</span>
                </div>
                <p className="text-sm text-slate font-body leading-relaxed">
                  {analysisResult?.reasoning || 
                    'Based on visual analysis, the image shows road surface damage consistent with a pothole. Key indicators include: irregular edges, depth variation, and surrounding asphalt deterioration. The location and size suggest medium priority for repair.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(analysisResult?.keywords || ['road damage', 'asphalt', 'pothole', 'infrastructure']).map((keyword, i) => (
                    <span key={i} className="px-2 py-1 bg-accent/10 font-display text-xs text-accent font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Description Section */}
              <div className="p-4 bg-cream-dark/30 border border-cream-muted">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-success" />
                    <span className="font-display text-sm font-medium text-slate-muted uppercase tracking-wider">Suggested Description</span>
                  </div>
                  <button
                    onClick={() => setIsEditingDescription(!isEditingDescription)}
                    className="flex items-center gap-1 font-display text-xs text-blueprint hover:text-blueprint/80 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isEditingDescription ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                
                {isEditingDescription ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-cream border border-cream-muted focus:border-blueprint/50 focus:outline-none text-slate font-body text-sm resize-none"
                      placeholder="Edit the AI-generated description..."
                    />
                    <button
                      onClick={handleSaveDescription}
                      className="flex items-center gap-2 px-4 py-2 bg-blueprint/10 text-blueprint font-display text-sm font-medium hover:bg-blueprint/20 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-slate font-body leading-relaxed">
                    {description || 'AI-generated description will appear here after analysis.'}
                  </p>
                )}
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 bg-warning/10 border-l-4 border-warning">
                <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-warning font-body">
                  AI analysis is for assistance only. Please verify details before submission.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
