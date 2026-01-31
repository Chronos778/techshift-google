/**
 * Qubrid AI Service - Integration Point
 * 
 * Handles interaction with Qubrid's Qwen/Qwen3-VL-8B-Instruct model for image analysis.
 */

const API_KEY = import.meta.env.VITE_QUBRID_API_KEY;
const API_URL = "https://platform.qubrid.com/api/v1/qubridai/multimodal/chat";

/**
 * Analyze image using Qwen-VL model via Qubrid API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} - Analysis result
 */
export async function analyzeImageWithQwen(imageUrl) {
    if (!API_KEY) {
        console.warn("Qubrid API Key is missing! Please set VITE_QUBRID_API_KEY in .env");
        return {
            description: "AI analysis unavailable (Missing API Key).",
            detectedIssueType: "unknown",
            confidence: 0
        };
    }

    const body = {
        "model": "Qwen/Qwen3-VL-8B-Instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Analyze this image efficiently. 1. Identify the main infrastructure issue (e.g., pothole, garbage, broken light, graffiti, flooding, or other). 2. Provide a short, clear description of the problem (max 2 sentences). 3. Estimate severity (Low, Medium, High). Return valid JSON: { \"issueType\": \"...\", \"description\": \"...\", \"severity\": \"...\" }."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": imageUrl
                        }
                    }
                ]
            }
        ],
        "max_tokens": 2048,
        "temperature": 0.7,
        "stream": false,
        "top_p": 0.9,
        "presence_penalty": 0
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`Qubrid API Error: ${res.statusText}`);
        }

        const result = await res.json();
        // console.log("Qubrid API Raw Response:", JSON.stringify(result, null, 2));

        // The API returns 'content' directly at the top level, or sometimes in choices depending on point/proxy.
        // Based on logs: { content: "...", ... }
        const content = result.content || result.choices?.[0]?.message?.content;

        // Attempt to parse JSON from the response content
        try {
            // Sometimes models wrap JSON in markdown code blocks like ```json ... ```
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                // Fallback if not valid JSON
                return {
                    issueType: "unknown",
                    description: content || "Could not generate description.",
                    severity: "medium"
                }
            }
        } catch (e) {
            console.warn("Failed to parse JSON from Qwen response", content);
            return {
                issueType: "unknown",
                description: content || "Analysis completed but format was unexpected.",
                severity: "medium"
            }
        }

    } catch (error) {
        console.error("Qubrid Analysis Failed:", error);
        throw error;
    }
}

export default {
    analyzeImageWithQwen
};
