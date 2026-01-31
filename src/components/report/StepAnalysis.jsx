import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Brain, Eye, Sparkles, Check, Edit2 } from 'lucide-react'
import { Button, Card, IssueTypeTag, issueTypes, AIAnalysisPanel } from '../ui'
import { analyzeImageWithQwen } from '../../services/qubrid'

const analysisStages = [
  { id: 'upload', label: 'Processing image...', icon: Eye },
  { id: 'qwen', label: 'Analyzing with Qwen AI...', icon: Brain },
  { id: 'complete', label: 'Analysis complete!', icon: Sparkles },
]

export default function StepAnalysis({ reportData, updateReportData, onNext, onBack }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [currentStage, setCurrentStage] = useState(0)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState('')

  useEffect(() => {
    if (reportData.analysisResult) {
      setIsAnalyzing(false)
      setCurrentStage(analysisStages.length - 1)
      setEditedDescription(reportData.description)
      return
    }

    const runAnalysis = async () => {
      try {
        // Only analyze if we have a real image URL from Firebase
        if (!reportData.imageUrl) {
          console.warn('No image URL available, skipping analysis')
          setIsAnalyzing(false)
          return
        }

        // Stage 1: Processing
        setCurrentStage(0)
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Stage 2: Qwen Analysis
        setCurrentStage(1)
        console.log('Analyzing image with Qwen AI:', reportData.imageUrl)

        const qwenResult = await analyzeImageWithQwen(reportData.imageUrl)
        console.log('Qwen result:', qwenResult)

        // Stage 3: Complete
        setCurrentStage(2)
        await new Promise((resolve) => setTimeout(resolve, 500))

        updateReportData({
          analysisResult: {
            qwen: qwenResult,
          },
          issueType: qwenResult.issueType?.toLowerCase().replace(/\s+/g, '-') || 'other',
          description: qwenResult.description,
        })
        setEditedDescription(qwenResult.description)
        setIsAnalyzing(false)
      } catch (error) {
        console.error('Analysis error:', error)
        setIsAnalyzing(false)
        // Fallback for demo if API fails
        setEditedDescription("Could not analyze image. Please describe the issue manually.")
      }
    }

    runAnalysis()
  }, [reportData.imageUrl, reportData.analysisResult, updateReportData])

  const handleDescriptionSave = () => {
    updateReportData({ description: editedDescription })
    setIsEditingDescription(false)
  }

  const handleIssueTypeSelect = (typeId) => {
    updateReportData({ issueType: typeId })
  }

  if (isAnalyzing) {
    return (
      <Card hover={false} className="p-8">
        <div className="flex flex-col items-center py-12">
          {/* Image preview */}
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-8">
            <img
              src={reportData.imagePreview}
              alt="Analyzing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />

            {/* Scanning animation */}
            <motion.div
              animate={{ y: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent"
            />
          </div>

          {/* Progress stages */}
          <div className="space-y-4 w-full max-w-sm mb-8">
            {analysisStages.map((stage, index) => {
              const Icon = stage.icon
              const isComplete = index < currentStage
              const isCurrent = index === currentStage

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-colors
                    ${isCurrent ? 'bg-neon-blue/10 border border-neon-blue/30' : ''}
                    ${isComplete ? 'opacity-60' : ''}
                  `}
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isComplete ? 'bg-neon-green text-dark-bg' : ''}
                      ${isCurrent ? 'bg-neon-blue/20 text-neon-blue' : ''}
                      ${!isComplete && !isCurrent ? 'bg-dark-border text-gray-500' : ''}
                    `}
                  >
                    {isComplete ? (
                      <Check className="w-4 h-4" />
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`
                      text-sm font-medium
                      ${isCurrent ? 'text-neon-blue' : isComplete ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    {stage.label}
                  </span>
                </motion.div>
              )
            })}
          </div>

          <p className="text-center text-gray-400 text-sm">
            Using Qwen AI (Qubrid) to detect objects and generate smart descriptions
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Panel with glassmorphism */}
      <AIAnalysisPanel
        isAnalyzing={false}
        analysisResult={{
          issueType: issueTypes.find(t => t.id === reportData.issueType) || issueTypes[0],
          confidence: reportData.analysisResult?.qwen?.confidence || 0.85,
          reasoning: `Analysis suggests this is a ${reportData.issueType || 'infrastructure'} issue.`,
          generatedDescription: reportData.description,
        }}
        onDescriptionChange={(newDesc) => updateReportData({ description: newDesc })}
        imagePreview={reportData.imagePreview}
      />

      {/* Issue Type Selection */}
      <Card hover={false} className="p-6">
        <label className="block text-sm text-gray-400 mb-3">
          Confirm or Change Issue Type
        </label>
        <div className="flex flex-wrap gap-2">
          {issueTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleIssueTypeSelect(type.id)}
              className={`
                transition-all duration-200
                ${reportData.issueType === type.id ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-dark-bg' : 'opacity-60 hover:opacity-100'}
              `}
            >
              <IssueTypeTag type={type.id} />
            </button>
          ))}
        </div>

        {/* Detected labels - Hidden for Qwen as it returns a description */
          false && (
            <div className="mt-4 pt-4 border-t border-dark-border">
              <label className="block text-xs text-gray-500 mb-2">
                Detected Objects
              </label>
              <div className="flex flex-wrap gap-2">
                {reportData.analysisResult?.vision?.labels?.slice(0, 5).map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-lg bg-dark-border text-xs text-gray-300"
                  >
                    {label.description} ({(label.score * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Back
        </Button>
        <Button onClick={onNext} icon={ArrowRight} iconPosition="right" size="lg">
          Continue to Location
        </Button>
      </div>
    </div>
  )
}
