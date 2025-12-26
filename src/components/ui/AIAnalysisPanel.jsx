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
      {/* Glassmorphism card */}
      <div 
        className="relative rounded-2xl p-6 border border-white/10"
        style={{
          background: 'rgba(17, 17, 24, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: isAnalyzing 
            ? '0 0 40px rgba(0, 212, 255, 0.15), inset 0 0 60px rgba(0, 212, 255, 0.05)' 
            : '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Animated border glow during analysis */}
        {isAnalyzing && (
          <motion.div
            key={pulseKey}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: '1px solid rgba(0, 212, 255, 0.5)',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.3), inset 0 0 30px rgba(0, 212, 255, 0.1)',
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <motion.div
              animate={isAnalyzing ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: isAnalyzing ? Infinity : 0, ease: 'linear' }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center"
            >
              <Brain className="w-5 h-5 text-neon-blue" />
            </motion.div>
            {isAnalyzing && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-xl bg-neon-blue/30"
              />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
            <p className="text-xs text-gray-400">
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-card/50"
                >
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: stage.delay }}
                  >
                    <stage.icon className="w-4 h-4 text-neon-blue" />
                  </motion.div>
                  <span className="text-sm text-gray-300">{stage.label}</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="ml-auto w-4 h-4 border-2 border-neon-blue/30 border-t-neon-blue rounded-full"
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
              <div className="p-4 rounded-xl bg-dark-card/50 border border-dark-border">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-neon-blue" />
                  <span className="text-sm font-medium text-gray-400">Detected Issue</span>
                </div>
                <div className="flex items-center justify-between">
                  <IssueTypeTag type={analysisResult?.issueType || 'pothole'} size="lg" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neon-blue">
                      {((analysisResult?.confidence || 0.89) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>
                
                {/* Confidence bar */}
                <div className="mt-3 h-2 bg-dark-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(analysisResult?.confidence || 0.89) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
                    style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}
                  />
                </div>
              </div>

              {/* AI Reasoning Section */}
              <div className="p-4 rounded-xl bg-dark-card/50 border border-dark-border">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-neon-purple" />
                  <span className="text-sm font-medium text-gray-400">AI Reasoning</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {analysisResult?.reasoning || 
                    'Based on visual analysis, the image shows road surface damage consistent with a pothole. Key indicators include: irregular edges, depth variation, and surrounding asphalt deterioration. The location and size suggest medium priority for repair.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(analysisResult?.keywords || ['road damage', 'asphalt', 'pothole', 'infrastructure']).map((keyword, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-neon-purple/10 text-xs text-neon-purple">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Description Section */}
              <div className="p-4 rounded-xl bg-dark-card/50 border border-dark-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neon-green" />
                    <span className="text-sm font-medium text-gray-400">Suggested Description</span>
                  </div>
                  <button
                    onClick={() => setIsEditingDescription(!isEditingDescription)}
                    className="flex items-center gap-1 text-xs text-neon-blue hover:text-neon-blue/80 transition-colors"
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
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border focus:border-neon-blue/50 focus:outline-none text-white text-sm resize-none"
                      placeholder="Edit the AI-generated description..."
                    />
                    <button
                      onClick={handleSaveDescription}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/20 text-neon-blue text-sm font-medium hover:bg-neon-blue/30 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {description || 'AI-generated description will appear here after analysis.'}
                  </p>
                )}
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-500/80">
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
