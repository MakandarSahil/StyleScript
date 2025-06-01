const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(
  cors({
    origin: "http://localhost:5173", // allow only your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // allow HTTP methods as needed
    credentials: true, // if you want to send cookies/auth headers
  })
);
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Helper function to clean Gemini API response text
function cleanGeminiResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/^\s*[\r\n]/gm, "")
    .trim();
}

// Enhanced prompt for comprehensive analysis
function createEnhancedPrompt(extractedFeatures, userText = "") {
  const genderSpecific =
    extractedFeatures.gender === "male"
      ? "The person is male, so provide recommendations tailored for men."
      : "The person is female, so provide recommendations tailored for women.";

  const basePrompt = `
You are a professional style consultant and color analyst. Based on the following detailed analysis of a person's features, provide comprehensive styling advice. ${genderSpecific}

EXTRACTED FEATURES:
- Skin Tone: ${extractedFeatures.skinTone} (RGB: ${
    extractedFeatures.skinToneRGB
  })
- Skin Undertone: ${extractedFeatures.skinUndertone}
- Hair Color: ${extractedFeatures.hairColor} (RGB: ${
    extractedFeatures.hairColorRGB
  })
- Eye Color: ${extractedFeatures.eyeColor} (RGB: ${
    extractedFeatures.eyeColorRGB
  })
- Face Shape: ${extractedFeatures.faceShape}
- Gender: ${extractedFeatures.gender}
- Age Group: ${extractedFeatures.ageGroup}
- Facial Features: ${JSON.stringify(extractedFeatures.facialFeatures)}
- Color Season: ${extractedFeatures.colorSeason}
- Dominant Colors: ${JSON.stringify(extractedFeatures.dominantColors)}
`;

  const textPrompt = userText
    ? `
USER'S SPECIFIC REQUEST:
"${userText}"

Please address this request specifically in your response, while still providing the comprehensive analysis.
`
    : "";

  const responseFormat = `
Please provide a comprehensive analysis in the following JSON format:

{
  "skinAnalysisResults": {
    "skinToneCategory": "detailed skin tone classification",
    "undertoneAnalysis": "detailed undertone explanation",
    "colorSeason": "Spring/Summer/Autumn/Winter classification",
    "bestColors": ["array of best colors for this skin tone"],
    "avoidColors": ["array of colors to avoid"]
  },
  "styleRecommendations": {
    "professional": {
      "clothing": ["specific professional outfit suggestions"],
      "colors": ["professional color palette"],
      "accessories": ["appropriate accessories"]
    },
    "casual": {
      "clothing": ["casual outfit suggestions"],
      "colors": ["casual color palette"],
      "accessories": ["casual accessories"]
    },
    "evening": {
      "clothing": ["evening wear suggestions"],
      "colors": ["evening color palette"],
      "accessories": ["evening accessories"]
    },
    "formal": {
      "clothing": ["formal wear suggestions"],
      "colors": ["formal color palette"],
      "accessories": ["formal accessories"]
    }
  },
  "colorCombinations": {
    "harmonious": ["color combinations that work well together"],
    "monochromatic": ["single color variations"],
    "complementary": ["complementary color pairs"],
    "triadic": ["three-color combinations"]
  },
  "personalizedTips": {
    "makeup": ["makeup recommendations based on features"],
    "hairStyling": ["hair styling suggestions"],
    "eyewear": ["eyewear recommendations for face shape"],
    "jewelry": ["jewelry recommendations"],
    "patterns": ["suitable patterns and prints"]
  },
  "seasonalAdvice": {
    "spring": ["spring wardrobe suggestions"],
    "summer": ["summer wardrobe suggestions"],
    "autumn": ["autumn wardrobe suggestions"],
    "winter": ["winter wardrobe suggestions"]
  },
  "shoppingGuide": {
    "priorityItems": ["must-have wardrobe items"],
    "budgetTips": ["budget-friendly shopping advice"],
    "brands": ["recommended brands or styles"],
    "versatilePieces": ["versatile clothing items"]
  },
  "specificRecommendations": {
    "faceShape": "recommendations based on face shape",
    "bodyType": "general body type recommendations",
    "lifestyle": "recommendations based on inferred lifestyle"
  },
  "userRequestResponse": ${
    userText ? `"detailed response to the user's specific request"` : "null"
  }
}

Provide detailed, actionable advice that considers all the extracted features holistically.`;

  return basePrompt + textPrompt + responseFormat;
}

// Handle text-only requests
async function handleTextOnlyRequest(userText) {
  try {
    const prompt = `You are a professional style consultant. The user has asked for advice without providing an image. Please provide helpful fashion/style advice based on their request.

User's request: "${userText}"

Please respond with a JSON object containing your advice in this format:
{
  "textResponse": "your detailed response to the user's request",
  "generalAdvice": {
    "clothingTips": ["array of general clothing tips"],
    "colorSuggestions": ["array of color suggestions"],
    "accessoryRecommendations": ["array of accessory recommendations"]
  }
}`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
        process.env.GEMINI_API_KEY || "AIzaSyAIO-WFrPD8T5L0ZLdOuUvNkr0Wsk6XvWs"
      }`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const geminiText = geminiResponse.data.candidates[0].content.parts[0].text;
    const cleanedText = cleanGeminiResponse(geminiText);

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return {
        textResponse: cleanedText,
        generalAdvice: {
          clothingTips: [],
          colorSuggestions: [],
          accessoryRecommendations: [],
        },
      };
    }
  } catch (error) {
    console.error("Error in text-only request:", error);
    return {
      error: "Failed to process text request",
      details: error.message,
    };
  }
}

app.post("/analyze", upload.single("image"), async (req, res) => {
  const userText = req.body.text || "";
  const imageFile = req.file;

  // Handle text-only requests
  if (!imageFile) {
    if (!userText) {
      return res
        .status(400)
        .json({ error: "Either image or text input is required." });
    }

    try {
      const textResponse = await handleTextOnlyRequest(userText);
      return res.json({
        success: true,
        textAnalysis: textResponse,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        error: "Text analysis failed",
        details: error.message,
      });
    }
  }

  const imagePath = imageFile.path;

  try {
    // Spawn Python process for feature extraction
    const python = spawn("python", ["extract_features.py", imagePath]);

    let result = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Python stderr:", data.toString());
    });

    python.on("close", async (code) => {
      // Clean up uploaded file (async)
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting uploaded file:", err);
        }
      });

      if (code !== 0) {
        console.error("Python process exited with code:", code);
        console.error("Error output:", errorOutput);
        return res.status(500).json({ error: "Image analysis failed." });
      }

      if (!result.trim()) {
        return res
          .status(500)
          .json({ error: "No output from image analysis." });
      }

      // Parse extracted features
      let extracted;
      try {
        extracted = JSON.parse(result);
      } catch (err) {
        console.error("Failed to parse Python output:", err);
        return res
          .status(500)
          .json({ error: "Invalid output from image analysis." });
      }

      console.log("Extracted features:", extracted);

      // Create enhanced prompt with user text if provided
      const prompt = createEnhancedPrompt(extracted, userText);

      try {
        // Call Gemini API
        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
            process.env.GEMINI_API_KEY ||
            "AIzaSyC-uNAtn01OdKczqPaCUAnNL0tt-yXoOTM"
          }`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2000,
            },
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 60000,
          }
        );

        const geminiText =
          geminiResponse.data.candidates[0].content.parts[0].text;
        const cleanedText = cleanGeminiResponse(geminiText);

        let parsedResponse;
        try {
          parsedResponse = JSON.parse(cleanedText);
        } catch (err) {
          console.warn(
            "Could not parse Gemini JSON response, sending raw text."
          );
          parsedResponse = { rawResponse: cleanedText };
        }

        return res.json({
          success: true,
          extractedFeatures: extracted,
          analysis: parsedResponse,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Gemini API error:", error);
        return res
          .status(500)
          .json({ error: "Failed to get response from Gemini API." });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
