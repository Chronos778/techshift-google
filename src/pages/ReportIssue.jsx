import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import StepUpload from '../components/report/StepUpload'
import StepAnalysis from '../components/report/StepAnalysis'
import StepLocation from '../components/report/StepLocation'
import StepConfirm from '../components/report/StepConfirm'
import { StepProgress } from '../components/ui'

export default function ReportIssue() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [reportData, setReportData] = useState({
    image: null,
    imagePreview: null,
    analysisResult: null,
    description: '',
    issueType: null,
    location: null,
  })

  const updateReportData = (data) => {
    setReportData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // TODO: Upload image to Firebase Storage
    // TODO: Save issue to Firestore
    console.log('[Report] Would submit report:', reportData)
    
    // Navigate to dashboard after "submission"
    navigate('/dashboard')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepUpload
            reportData={reportData}
            updateReportData={updateReportData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <StepAnalysis
            reportData={reportData}
            updateReportData={updateReportData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <StepLocation
            reportData={reportData}
            updateReportData={updateReportData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <StepConfirm
            reportData={reportData}
            updateReportData={updateReportData}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Report an Issue
          </h1>
          <p className="text-gray-400">
            Help improve your city by reporting infrastructure problems
          </p>
        </motion.div>

        {/* Enhanced Step Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <StepProgress currentStep={currentStep} />
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
