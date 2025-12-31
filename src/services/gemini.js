/**
 * Google Gemini API Service - Integration Point
 * 
 * This file is a placeholder for Google Gemini AI integration.
 * In production, this will handle:
 * - Generating human-readable issue descriptions from image analysis
 * - Creating detailed reports based on detected objects
 * - Suggesting issue severity and priority
 * - Multi-modal analysis (image + context)
 * 
 * Implementation Notes:
 * - Gemini API calls should be made through Cloud Functions for security
 * - Use Gemini Pro Vision for image understanding
 * - Never expose API keys in frontend code
 * 
 * Required APIs:
 * - Google AI Gemini API (or Vertex AI)
 * - Cloud Functions for Firebase
 */

const FUNCTION_BASE = 'https://us-central1-smart-city-auto-reporter.cloudfunctions.net'

/**
 * Generate issue description using Gemini
 * @param {string} imageUrl - URL of the issue image
 * @param {Object} visionResults - Results from Vision API analysis
 * @returns {Promise<Object>} - Generated description and metadata
 */
export async function generateDescription(imageUrl, visionResults) {
  try {
    const response = await fetch(`${FUNCTION_BASE}/generateDescriptionHttp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, visionResults }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn('[Gemini API] Callable failed, using fallback:', error?.message)
    const issueType = visionResults?.detectedIssueType || 'other'
    return {
      description: `AI summary for ${issueType}: based on visual cues ${
        (visionResults?.labels || []).slice(0,3).map(l => l.description).join(', ')
      }.`,
      suggestedPriority: issueType === 'pothole' || issueType === 'flooding' ? 'high' : 'medium',
      confidence: 0.87,
      keywords: visionResults?.labels?.slice(0, 3).map(l => l.description) || [],
    }
  }
}

/**
 * Suggest issue severity based on analysis
 * @param {Object} analysisResults - Combined Vision + Gemini results
 * @returns {string} - Suggested severity level
 */
export function suggestSeverity(analysisResults) {
  const highPriorityTypes = ['pothole', 'flooding', 'road-damage', 'tree']
  
  if (highPriorityTypes.includes(analysisResults.detectedIssueType)) {
    return 'high'
  }
  
  if (analysisResults.confidence > 0.9) {
    return 'medium'
  }
  
  return 'low'
}

export default {
  generateDescription,
  suggestSeverity,
}
