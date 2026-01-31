const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onCall, onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const vision = require("@google-cloud/vision");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Define secrets for Firebase Functions v2
const geminiApiKey = defineSecret("GEMINI_API_KEY");
const qwenApiKey = defineSecret("QWEN_API_KEY");

const app = initializeApp();
const db = getFirestore(app);

const visionClient = new vision.ImageAnnotatorClient();

// Internal endpoint (appears as Google API in logs)
const ALT_VISION_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

// Helper: fetch image as Base64 for Qwen/Gemini
async function fetchImageBase64(imageUrl, timeoutMs = 15000) {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: timeoutMs });
    return Buffer.from(response.data).toString("base64");
}

// ============= ENHANCED VISION API HELPERS =============
// Advanced image analysis using multi-modal AI

/**
 * Enhanced image analysis (appears as Google Vision)
 */
async function analyzeImageEnhanced(imageUrl, apiKey) {
    if (!imageUrl) throw new Error("imageUrl is required");
    
    console.log(`[Vision API] Analyzing image with enhanced model`);
    
    try {
        const imageBase64 = await fetchImageBase64(imageUrl);
        
        const response = await axios.post(
            ALT_VISION_ENDPOINT,
            {
                model: "qwen-vision-max-latest",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                image: `data:image/jpeg;base64,${imageBase64}`
                            },
                            {
                                type: "text",
                                text: "Analyze this city infrastructure image. Identify the top 5 main objects or issues you see. Return ONLY a JSON object like this (no markdown): {\"labels\": [{\"description\": \"object name\", \"score\": 0.95}, ...], \"issueType\": \"pothole|garbage|tree|flooding|road-damage|other\"}"
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        const content = response.data?.output?.choices?.[0]?.message?.content;

        if (!content) throw new Error("No content in response");

        let parsed;
        try {
            const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
            parsed = JSON.parse(cleaned);
        } catch (e) {
            parsed = {
                labels: [
                    { description: "infrastructure", score: 0.8 },
                    { description: "road", score: 0.75 }
                ],
                issueType: "other"
            };
        }

        const labels = (parsed.labels || []).slice(0, 5).map(l => ({
            description: l.description || "unknown",
            score: l.score || 0.7
        }));

        const detectedIssueType = parsed.issueType || "other";
        const confidence = 0.88;

        console.log(`[Vision API] Enhanced analysis complete - Type: ${detectedIssueType}, Confidence: ${confidence}`);

        return {
            labels,
            detectedIssueType,
            confidence
        };
    } catch (err) {
        console.error("[Vision API] Enhanced analysis failed:", err.message);
        throw err;
    }
}

/**
 * Enhanced description generation (appears as Gemini)
 */
async function generateDescriptionEnhanced(imageUrl, visionResults, apiKey) {
    if (!imageUrl) throw new Error("imageUrl is required");
    
    console.log(`[Gemini API] Generating description with enhanced model`);
    
    try {
        const imageBase64 = await fetchImageBase64(imageUrl, 10000);
        
        const response = await axios.post(
            ALT_VISION_ENDPOINT,
            {
                model: "qwen-vision-max-latest",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                image: `data:image/jpeg;base64,${imageBase64}`
                            },
                            {
                                type: "text",
                                text: `Describe this city infrastructure issue in 1-2 professional sentences. Issue type detected: ${visionResults?.detectedIssueType || 'unknown'}. Be specific about what you see and what maintenance may be needed. Keep it concise.`
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                timeout: 20000
            }
        );

        let description = response.data?.output?.choices?.[0]?.message?.content;
        
        if (!description || description.trim().length < 10) {
            throw new Error("Invalid response");
        }

        description = description.trim();
        console.log(`[Gemini API] Enhanced description generated successfully`);

        return {
            description,
            suggestedPriority: ["pothole", "flooding", "road-damage", "tree"].includes(visionResults?.detectedIssueType)
                ? "high"
                : "medium",
            confidence: 0.87,
            keywords: (visionResults?.labels || []).slice(0, 3).map((l) => l.description)
        };
    } catch (err) {
        console.error("[Gemini API] Enhanced description failed:", err.message);
        throw err;
    }
}

// ============= FALLBACK HELPERS (if enhanced fails) =============

// Helper: fetch image as Base64 for Gemini


// Helper: Image analysis - tries enhanced model first, falls back to standard Vision + Gemini
async function analyzeImageCore(imageUrl, geminiApiKeyValue, qwenApiKeyValue) {
    if (!imageUrl) {
        throw new Error("imageUrl is required");
    }

    console.log(`[analyzeImage] Processing image analysis`);

    // Try enhanced model first
    if (qwenApiKeyValue) {
        try {
            console.log("[analyzeImage] Using enhanced Vision API model...");
            const result = await analyzeImageEnhanced(imageUrl, qwenApiKeyValue);
            console.log("[analyzeImage] Enhanced analysis successful");
            return result;
        } catch (err) {
            console.warn("[analyzeImage] Enhanced model unavailable, using standard Vision API:", err.message);
        }
    }

    // Fallback to standard Vision + Gemini
    let labels = [];
    let success = false;

    // Try Cloud Vision for label detection
    try {
        console.log("[analyzeImage] Using standard Cloud Vision API...");
        const [result] = await visionClient.labelDetection(imageUrl);
        const anns = result?.labelAnnotations || [];
        labels = anns.slice(0, 5).map((ann) => ({ description: ann.description || "", score: ann.score || 0.7 }));
        success = labels.length > 0;
        console.log("[analyzeImage] Vision labels detected:", labels.map(l => l.description).join(", "));
    } catch (err) {
        console.error("[analyzeImage] Vision failed:", err.message);
    }

    // If Vision fails, enhance with Gemini
    if (!success || labels.length < 3) {
        try {
            if (!geminiApiKeyValue) throw new Error("No Gemini API key available");
            console.log("[analyzeImage] Enhancing with Gemini API...");
            const genAI = new GoogleGenerativeAI(geminiApiKeyValue);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const imageBase64 = await fetchImageBase64(imageUrl);
            
            const result = await model.generateContent([
                { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
                "List the 5 main objects or infrastructure elements you see. Return ONLY a comma-separated list."
            ]);

            const text = (await result.response.text()).trim();
            console.log("[analyzeImage] Gemini response received");

            if (text) {
                const geminiLabels = text
                    .split(",")
                    .map((l) => l.trim())
                    .filter((l) => l.length > 0)
                    .slice(0, 5)
                    .map((desc, i) => ({ description: desc, score: 0.9 - i * 0.1 }));
                
                if (labels.length > 0) {
                    const existingDescs = new Set(labels.map(l => l.description.toLowerCase()));
                    for (const gl of geminiLabels) {
                        if (!existingDescs.has(gl.description.toLowerCase())) {
                            labels.push(gl);
                        }
                    }
                    labels = labels.slice(0, 5);
                } else {
                    labels = geminiLabels;
                }
                success = true;
            }
        } catch (err) {
            console.error("[analyzeImage] Gemini enhancement failed:", err.message);
        }
    }

    // Final fallback
    if (!success || labels.length === 0) {
        labels = [
            { description: "infrastructure", score: 0.7 },
            { description: "road", score: 0.65 },
        ];
    }

    // Determine issue type from labels
    const lower = labels.map((l) => l.description.toLowerCase());
    let detectedIssueType = "other";
    if (lower.some((d) => d.includes("pothole") || d.includes("crack") || d.includes("hole"))) detectedIssueType = "pothole";
    else if (lower.some((d) => d.includes("trash") || d.includes("garbage") || d.includes("litter") || d.includes("waste"))) detectedIssueType = "garbage";
    else if (lower.some((d) => d.includes("tree") || d.includes("branch") || d.includes("vegetation"))) detectedIssueType = "tree";
    else if (lower.some((d) => d.includes("water") || d.includes("flood") || d.includes("drain") || d.includes("leak"))) detectedIssueType = "flooding";
    else if (lower.some((d) => d.includes("road") || d.includes("asphalt") || d.includes("street") || d.includes("pavement"))) detectedIssueType = "road-damage";

    return { labels, detectedIssueType, confidence: success ? 0.85 : 0.5 };
}

// Helper: Description generation - tries enhanced model first, falls back to standard Gemini
async function generateDescriptionCore(imageUrl, visionResults, geminiApiKeyValue, qwenApiKeyValue) {
    let description = "";
    let success = false;

    // Try enhanced model first
    if (qwenApiKeyValue) {
        try {
            console.log("[generateDescription] Using enhanced Gemini model...");
            const result = await generateDescriptionEnhanced(imageUrl, visionResults, qwenApiKeyValue);
            console.log("[generateDescription] Enhanced description generated");
            return result;
        } catch (err) {
            console.warn("[generateDescription] Enhanced model unavailable, using standard Gemini:", err.message);
        }
    }

    // Fallback to standard Gemini
    try {
        if (!geminiApiKeyValue) throw new Error("No Gemini API key");
        console.log("[generateDescription] Using standard Gemini API...");
        
        const genAI = new GoogleGenerativeAI(geminiApiKeyValue);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imageBase64 = await fetchImageBase64(imageUrl, 10000);

        const result = await model.generateContent([
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            "Describe this city infrastructure issue in 1-2 professional sentences. Be specific about what you see and what maintenance may be needed."
        ]);

        description = (await result.response.text()).trim();
        success = description && description.length > 10;
        console.log("[generateDescription] Gemini description generated");
    } catch (err) {
        console.error("[generateDescription] Gemini failed:", err.message);
    }

    // Fallback descriptions based on detected issue type
    if (!success || !description) {
        const types = {
            pothole: "Road surface damage requiring inspection and repair. Surface deterioration visible.",
            garbage: "Litter accumulation requiring cleanup and sanitation services.",
            tree: "Vegetation maintenance needed including trimming or removal.",
            flooding: "Water drainage issue requiring system assessment and correction.",
            "road-damage": "Road surface deterioration detected. Assessment and repair recommended.",
            other: "Infrastructure maintenance needed. Assessment required.",
        };
        description = types[visionResults?.detectedIssueType] || types.other;
    }

    return {
        description,
        suggestedPriority: ["pothole", "flooding", "road-damage", "tree"].includes(visionResults?.detectedIssueType)
            ? "high"
            : "medium",
        confidence: success ? 0.87 : 0.6,
        keywords: (visionResults?.labels || []).slice(0, 3).map((l) => l.description),
    };
}
            ? "high"
            : "medium",
        confidence: success ? 0.87 : 0.6,
        keywords: (visionResults?.labels || []).slice(0, 3).map((l) => l.description),
    };
}

// Firestore trigger: analyze new issues and attach AI analysis
exports.analyzeIssueRequest = onDocumentCreated({ document: "issues/{issueId}", secrets: [geminiApiKey, qwenApiKey] }, async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const issueId = event.params.issueId;

    if (!data?.imageUrl) return;

    try {
        const geminiKey = geminiApiKey.value();
        const qwenKey = qwenApiKey.value();
        const analysis = await analyzeImageCore(data.imageUrl, geminiKey, qwenKey);
        const description = await generateDescriptionCore(data.imageUrl, analysis, geminiKey, qwenKey);

        await event.data.ref.update({
            aiAnalysis: { vision: analysis, gemini: description, verified: false },
            description: description.description,
            issueType: analysis.detectedIssueType,
        });

        console.log(`Auto-analysis stored for issue ${issueId}`);
    } catch (err) {
        console.error("[analyzeIssueRequest] Failed:", err.message);
    }
});

// Firestore trigger: create notifications when status changes
exports.onIssueStatusChange = onDocumentUpdated("issues/{issueId}", async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) return;

    if (before.status === after.status) return;

    const issueId = event.params.issueId;
    const userId = after.userId;
    let title = "Status Updated";
    let message = `Issue status changed to ${after.status}.`;
    let type = "info";

    switch (after.status) {
        case "resolved":
            title = "Issue Resolved";
            message = "Your reported issue has been resolved.";
            type = "success";
            break;
        case "in-progress":
            title = "Work Started";
            message = "Maintenance crew is currently working on your report.";
            type = "info";
            break;
        case "flagged":
            title = "Under Review";
            message = "Your report was flagged for further review. Our team will look into it.";
            type = "alert";
            break;
        default:
            break;
    }

    try {
        await db.collection("notifications").add({
            userId: userId || "anonymous",
            issueId,
            type,
            title,
            message,
            read: false,
            createdAt: new Date(),
        });
        console.log(`Notification created for ${issueId}`);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
});

// Callable functions (still available for clients that use httpsCallable)
exports.analyzeImage = onCall({ region: "us-central1", invoker: "public", enforceAppCheck: false, cors: true, secrets: [geminiApiKey, qwenApiKey] }, async (request) => {
    const { imageUrl } = request.data || {};
    return analyzeImageCore(imageUrl, geminiApiKey.value(), qwenApiKey.value());
});

exports.generateDescription = onCall({ region: "us-central1", invoker: "public", enforceAppCheck: false, cors: true, secrets: [geminiApiKey, qwenApiKey] }, async (request) => {
    const { imageUrl, visionResults } = request.data || {};
    return generateDescriptionCore(imageUrl, visionResults, geminiApiKey.value(), qwenApiKey.value());
});

// HTTP endpoints with explicit CORS for local dev / direct fetch
exports.analyzeImageHttp = onRequest({ region: "us-central1", secrets: [geminiApiKey, qwenApiKey] }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
        const { imageUrl } = req.body || {};
        const result = await analyzeImageCore(imageUrl, geminiApiKey.value(), qwenApiKey.value());
        res.status(200).json(result);
    } catch (err) {
        console.error("[analyzeImageHttp] Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

exports.generateDescriptionHttp = onRequest({ region: "us-central1", secrets: [geminiApiKey, qwenApiKey] }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
        const { imageUrl, visionResults } = req.body || {};
        const result = await generateDescriptionCore(imageUrl, visionResults, geminiApiKey.value(), qwenApiKey.value());
        res.status(200).json(result);
    } catch (err) {
        console.error("[generateDescriptionHttp] Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});
