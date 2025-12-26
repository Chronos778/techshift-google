import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Image, X, ArrowRight } from 'lucide-react'
import { Button, Card } from '../ui'

export default function StepUpload({ reportData, updateReportData, onNext }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      // TODO: Upload image to Firebase Storage
      const reader = new FileReader()
      reader.onload = (e) => {
        updateReportData({
          image: file,
          imagePreview: e.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }, [updateReportData])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }, [handleFileSelect])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const removeImage = () => {
    updateReportData({
      image: null,
      imagePreview: null,
    })
  }

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Capture or Upload Image
        </h2>
        <p className="text-gray-400 mb-6">
          Take a photo or upload an image of the city issue you want to report
        </p>

        {reportData.imagePreview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <img
              src={reportData.imagePreview}
              alt="Issue preview"
              className="w-full h-80 object-cover rounded-xl"
            />
            <button
              onClick={removeImage}
              className="absolute top-3 right-3 p-2 rounded-full bg-dark-bg/80 text-white hover:bg-red-500/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center
              transition-all duration-300 cursor-pointer
              ${
                isDragging
                  ? 'border-neon-blue bg-neon-blue/10'
                  : 'border-dark-border hover:border-neon-blue/50 hover:bg-dark-card/50'
              }
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ y: isDragging ? -10 : 0 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center mb-6"
              >
                <Upload className="w-10 h-10 text-neon-blue" />
              </motion.div>
              
              <p className="text-lg font-medium text-white mb-2">
                {isDragging ? 'Drop your image here' : 'Drag and drop your image'}
              </p>
              <p className="text-gray-400 mb-4">or click to browse</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Image className="w-4 h-4" />
                <span>Supports JPG, PNG, HEIC up to 10MB</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile camera option */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dark-border hover:border-neon-blue/50 transition-colors">
              <Camera className="w-5 h-5 text-neon-blue" />
              <span className="text-white font-medium">Take Photo</span>
            </div>
          </label>
          
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dark-border hover:border-neon-blue/50 transition-colors">
              <Upload className="w-5 h-5 text-neon-purple" />
              <span className="text-white font-medium">Upload File</span>
            </div>
          </label>
        </div>
      </Card>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!reportData.imagePreview}
          icon={ArrowRight}
          iconPosition="right"
          size="lg"
        >
          Continue to Analysis
        </Button>
      </div>
    </div>
  )
}
