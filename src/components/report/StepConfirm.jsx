import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, MapPin, Brain, CheckCircle } from 'lucide-react'
import { Button, Card, IssueTypeTag } from '../ui'

export default function StepConfirm({ reportData, onSubmit, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Wait a moment before navigating
    setTimeout(() => {
      onSubmit()
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <Card hover={false} className="p-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-neon-green" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Report Submitted!
          </h2>
          <p className="text-gray-400 mb-6">
            Thank you for helping improve your city. You'll be redirected to the dashboard.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-neon-green">Report ID: #RPT-{Date.now().toString().slice(-6)}</span>
          </div>
        </motion.div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Review Your Report
        </h2>
        <p className="text-gray-400 mb-6">
          Please verify all information before submitting
        </p>

        <div className="space-y-6">
          {/* Image and issue type */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Issue Photo</label>
              <img
                src={reportData.imagePreview}
                alt="Issue"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Issue Type</label>
                <IssueTypeTag type={reportData.issueType} size="lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">AI Confidence</label>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-neon-purple" />
                  <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(reportData.analysisResult?.vision?.confidence || 0.85) * 100}%` }}
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                    />
                  </div>
                  <span className="text-sm text-white">
                    {((reportData.analysisResult?.vision?.confidence || 0.85) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
              <p className="text-gray-300 text-sm leading-relaxed">
                {reportData.description}
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Location</label>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-card border border-dark-border">
              <MapPin className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
              <div>
                <p className="text-white">{reportData.location?.address}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {reportData.location?.lat.toFixed(6)}, {reportData.location?.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submission notice */}
        <div className="mt-6 p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/30">
          <p className="text-sm text-gray-300">
            <span className="text-neon-blue font-medium">Note:</span> By submitting this report,
            you agree to share the image and location data with city authorities for issue resolution.
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} icon={ArrowLeft}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          icon={Send}
          iconPosition="right"
          size="lg"
        >
          {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  )
}
