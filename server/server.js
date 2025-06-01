const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Helper function to clean Gemini API response text of markdown backticks
function cleanGeminiResponse(text) {
  return text
    .replace(/```json/, "")
    .replace(/```/, "")
    .trim();
}

app.post("/analyze", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;

  const python = spawn("python", ["extract_features.py", imagePath]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  python.on("close", async () => {
    try {
      const extracted = JSON.parse(result);

      const prompt = `
User Details:
Skin Tone: ${extracted.skinTone}
Gender: ${extracted.gender}
Hair Color: ${extracted.hairColor}
Eye Color: ${extracted.eyeColor}
Face Shape: ${extracted.faceShape}
Body Shape: ${extracted.bodyShape}
Age Group: ${extracted.ageGroup}
Suitable Colors: ${JSON.stringify(extracted.suitableColors)}

Based on this, provide:
1. skinAnalysisResults
2. styleRecommendations
3. outfitSuggestions
4. colorCombinations
5. personalizedTips
6. seasonalAdvice
7. shoppingGuide

Respond in JSON format.
      `;

      const geminiResponse = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBv_-6HxbmCygVXNAsBJ-q5o6c6G6xNMd0",
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );

      const geminiText =
        geminiResponse.data.candidates[0].content.parts[0].text;

      console.log("Gemini raw response text:", geminiText);

      const cleanedText = cleanGeminiResponse(geminiText);

      const geminiJson = JSON.parse(cleanedText);

      res.json({
        features: extracted,
        geminiResponse: geminiJson,
      });
    } catch (error) {
      if (error.response) {
        console.error("Gemini API error response:", error.response.data);
      } else {
        console.error("Gemini error:", error.message);
      }
      res.status(500).json({ error: "Gemini API failed." });
    }
  });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
