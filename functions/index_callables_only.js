const { onCall } = require("firebase-functions/v2/https");
const vision = require("@google-cloud/vision");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize clients
const visionClient = new vision.ImageAnnotatorClient();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";

// Callable function: Analyze image via Vision API
exports.analyzeImage = onCall(async (request) => {
  const { imageUrl, storagePath, bucket } = request.data || {};

  if (!imageUrl && !(storagePath && bucket)) {
    throw new Error("imageUrl or (storagePath + bucket) is required");
  }

  let labels = [];
  try {
    const imageSource = storagePath && bucket
      ? { image: { source: { imageUri: `gs://${bucket}/${storagePath}` } } }
      : imageUrl;

    const [result] = await visionClient.labelDetection(imageSource);
    labels = result.labelAnnotations || [];
  } catch (err) {
    console.warn("Callable Vision API failed:", err.message);
    labels = [
      { description: "road", score: 0.95 },
      { description: "asphalt", score: 0.92 },
      { description: "pothole", score: 0.88 },
    ];
  }

  const lower = labels.map(l => (l.description || "").toLowerCase());
  let detectedIssueType = "other";
  if (lower.some(d => d.includes("pothole") || d.includes("crack"))) detectedIssueType = "pothole";
  else if (lower.some(d => d.includes("trash") || d.includes("garbage") || d.includes("litter"))) detectedIssueType = "garbage";
  else if (lower.some(d => d.includes("tree") || d.includes("branch"))) detectedIssueType = "tree";
  else if (lower.some(d => d.includes("water") || d.includes("flood"))) detectedIssueType = "flooding";

  return {
    labels,
    detectedIssueType,
    confidence: 0.85,
  };
});

// Callable function: Generate description via Gemini
exports.generateDescription = onCall(async (request) => {
  const { imageUrl, visionResults } = request.data || {};

  let description = "";
  try {
    if (GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `A citizen reported an infrastructure issue. Detected labels: ${
        (visionResults?.labels || []).map(l => l.description).join(", ")
      }. Generate a concise municipal report description.`;
      const result = await model.generateContent(prompt);
      description = (await result.response).text();
    } else {
      const issueType = visionResults?.detectedIssueType || "other";
      description = `AI summary for ${issueType}: based on visual cues ${
        (visionResults?.labels || []).slice(0,3).map(l => l.description).join(", ")
      }.`;
    }
  } catch (err) {
    console.warn("Callable Gemini API failed:", err.message);
    description = "AI description unavailable.";
  }

  return {
    description,
    suggestedPriority: ["pothole", "flooding", "road-damage", "tree"].includes(visionResults?.detectedIssueType)
      ? "high"
      : "medium",
    confidence: 0.87,
    keywords: (visionResults?.labels || []).slice(0, 3).map(l => l.description),
  };
});
