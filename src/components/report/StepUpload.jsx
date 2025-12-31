import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Image, X, ArrowRight, AlertCircle } from 'lucide-react'
import { Button, Card } from '../ui'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase'

export default function StepUpload({ reportData, updateReportData, onNext }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const handleFileSelect = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file')
      return
    }

    setUploadError(null)
    setIsUploading(true)

    try {
      // Read preview
      const reader = new FileReader()
      reader.onload = async (e) => {
        updateReportData({
          image: file,
          imagePreview: e.target.result,
        })
      }
      reader.readAsDataURL(file)

      // Upload to Firebase Storage
      const imageRef = ref(storage, `issues/${Date.now()}_${file.name}`)
      const uploadResult = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(uploadResult.ref)

      console.log('Image uploaded successfully:', downloadURL)

      updateReportData({
        image: file,
        imageUrl: downloadURL,
        storagePath: uploadResult.ref.fullPath,
        bucket: uploadResult.ref.bucket,
      })

      setIsUploading(false)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(`Upload failed: ${error.message}`)
      setIsUploading(false)
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
          Take a photo or upload an image of the city issue you want to report. Our AI will analyze it to verify the issue type.
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
        <div className="mt-6 flex flex-col gap-3">
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">{uploadError}</p>
            </div>
          )}

          {isUploading && (
            <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4"
              >
                <Upload className="w-4 h-4 text-blue-400" />
              </motion.div>
              <p className="text-sm text-blue-300">Uploading image...</p>
            </div>
          )}

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              disabled={isUploading}
              className="hidden"
            />
            <div className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-dark-border hover:border-neon-blue/50 transition-colors min-h-[44px] ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Camera className="w-5 h-5 text-neon-blue" />
              <span className="text-white font-medium">Take Photo</span>
            </div>
          </label>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-dark-border hover:border-neon-blue/50 transition-colors min-h-[44px]">
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
          disabled={!reportData.imageUrl || isUploading}
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
