import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, MapPin, Brain, CheckCircle } from 'lucide-react'
import { Button, Card, IssueTypeTag } from '../ui'

export default function StepConfirm({ reportData, onSubmit, onBack, isSubmitting }) {
  // Navigation is handled by parent (ReportIssue.jsx) on successful submission

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-8">
        <h2 className="font-display text-xl font-semibold text-slate mb-2">
          Review Your Report
        </h2>
        <p className="text-slate-muted font-body mb-6">
          Please verify all information before submitting
        </p>

        <div className="space-y-6">
          {/* Image and issue type */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-display text-sm text-slate-muted mb-2 uppercase tracking-wider">Issue Photo</label>
              <img
                src={reportData.imagePreview}
                alt="Issue"
                className="w-full h-48 object-cover border border-cream-muted"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-display text-sm text-slate-muted mb-2 uppercase tracking-wider">Issue Type</label>
                <IssueTypeTag type={reportData.issueType} size="lg" />
              </div>
              <div>
                <label className="block font-display text-sm text-slate-muted mb-2 uppercase tracking-wider">AI Confidence</label>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-accent" />
                  <div className="flex-1 h-2 bg-cream-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(reportData.analysisResult?.vision?.confidence || 0.85) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blueprint to-accent"
                    />
                  </div>
                  <span className="text-sm font-display font-bold text-slate">
                    {((reportData.analysisResult?.vision?.confidence || 0.85) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-display text-sm text-slate-muted mb-2 uppercase tracking-wider">Description</label>
            <div className="p-4 bg-cream-dark/30 border border-cream-muted">
              <p className="text-slate font-body text-sm leading-relaxed">
                {reportData.description}
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-display text-sm text-slate-muted mb-2 uppercase tracking-wider">Location</label>
            <div className="flex items-start gap-3 p-4 bg-cream-dark/30 border border-cream-muted">
              <MapPin className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-slate font-body">{reportData.location?.address}</p>
                {reportData.location?.lat && reportData.location?.lng && (
                  <p className="text-sm text-slate-muted font-mono mt-1">
                    {reportData.location.lat.toFixed(6)}, {reportData.location.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submission notice */}
        <div className="mt-6 p-4 bg-blueprint/5 border-l-4 border-blueprint">
          <p className="text-sm text-slate font-body">
            <span className="text-blueprint font-display font-semibold">Note:</span> By submitting this report,
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
          onClick={onSubmit}
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
