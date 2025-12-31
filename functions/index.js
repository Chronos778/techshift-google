const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onCall, onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const vision = require("@google-cloud/vision");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const app = initializeApp();
const db = getFirestore(app);
// db.settings({ ignoreUndefinedProperties: true }); // Good practice, but optional. Removed bad config.

const visionClient = new vision.ImageAnnotatorClient();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Helper: Gemini image analysis
async function analyzeImageCore(imageUrl) {
    if (!imageUrl) {
        throw new Error("imageUrl is required");
    }

    console.log(`[analyzeImage] Analyzing:`, imageUrl.substring(0, 80));
    let labels = [];
    let success = false;

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const response = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 10000 });
        const imageBase64 = Buffer.from(response.data).toString("base64");

        const result = await model.generateContent([
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            "List the 5 main objects or infrastructure elements you see. Return ONLY a comma-separated list."
        ]);

        const text = (await result.response.text()).trim();
        console.log("[analyzeImage] Gemini response:", text);

        if (text) {
            labels = text
                .split(",")
                .map((l) => l.trim())
                .filter((l) => l.length > 0)
                .slice(0, 5)
                .map((desc, i) => ({ description: desc, score: 0.9 - i * 0.1 }));
            success = true;
        }
    } catch (err) {
        console.error("[analyzeImage] Gemini failed:", err.message);
    }

    if (!success || labels.length === 0) {
        labels = [
            { description: "infrastructure", score: 0.7 },
            { description: "road", score: 0.65 },
        ];
    }

    const lower = labels.map((l) => l.description.toLowerCase());
    let detectedIssueType = "other";
    if (lower.some((d) => d.includes("pothole") || d.includes("crack") || d.includes("hole"))) detectedIssueType = "pothole";
    else if (lower.some((d) => d.includes("trash") || d.includes("garbage") || d.includes("litter") || d.includes("waste"))) detectedIssueType = "garbage";
    else if (lower.some((d) => d.includes("tree") || d.includes("branch") || d.includes("vegetation"))) detectedIssueType = "tree";
    else if (lower.some((d) => d.includes("water") || d.includes("flood") || d.includes("drain") || d.includes("leak"))) detectedIssueType = "flooding";
    else if (lower.some((d) => d.includes("road") || d.includes("asphalt") || d.includes("street") || d.includes("pavement"))) detectedIssueType = "road-damage";

    return { labels, detectedIssueType, confidence: success ? 0.85 : 0.5 };
}

// Helper: Gemini description generation
async function generateDescriptionCore(imageUrl, visionResults) {
    let description = "";
    let success = false;

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const response = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 10000 });
        const imageBase64 = Buffer.from(response.data).toString("base64");

        const result = await model.generateContent([
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            "Describe this city infrastructure issue in 1-2 professional sentences. Be specific."
        ]);

        description = (await result.response.text()).trim();
        success = description && description.length > 10;
    } catch (err) {
        console.error("[generateDescription] Failed:", err.message);
    }

    if (!success || !description) {
        const types = {
            pothole: "Road surface damage requiring inspection and repair. Surface deterioration visible.",
            garbage: "Litter accumulation requiring cleanup and sanitation services.",
            tree: "Vegetation maintenance needed including trimming or removal.",
            flooding: "Water drainage issue requiring system assessment and correction.",
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

// Firestore trigger: analyze new issues and attach AI analysis
exports.analyzeIssueRequest = onDocumentCreated("issues/{issueId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const issueId = event.params.issueId;

    if (!data?.imageUrl) return;

    try {
        const analysis = await analyzeImageCore(data.imageUrl);
        const description = await generateDescriptionCore(data.imageUrl, analysis);

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
exports.analyzeImage = onCall({ region: "us-central1", invoker: "public", enforceAppCheck: false, cors: true }, async (request) => {
    const { imageUrl } = request.data || {};
    return analyzeImageCore(imageUrl);
});

exports.generateDescription = onCall({ region: "us-central1", invoker: "public", enforceAppCheck: false, cors: true }, async (request) => {
    const { imageUrl, visionResults } = request.data || {};
    return generateDescriptionCore(imageUrl, visionResults);
});

// HTTP endpoints with explicit CORS for local dev / direct fetch
exports.analyzeImageHttp = onRequest({ region: "us-central1" }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
        const { imageUrl } = req.body || {};
        const result = await analyzeImageCore(imageUrl);
        res.status(200).json(result);
    } catch (err) {
        console.error("[analyzeImageHttp] Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

exports.generateDescriptionHttp = onRequest({ region: "us-central1" }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
        const { imageUrl, visionResults } = req.body || {};
        const result = await generateDescriptionCore(imageUrl, visionResults);
        res.status(200).json(result);
    } catch (err) {
        console.error("[generateDescriptionHttp] Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});
