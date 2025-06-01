const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

function cleanGeminiResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

app.post("/analyze", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = req.file.path;

  try {
    const python = spawn("python", ["extract_features.py", imagePath]);

    let result = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python script failed:", errorOutput);
        return res.status(500).json({
          error: "Feature extraction failed",
          details: errorOutput,
        });
      }

      try {
        const extracted = JSON.parse(result);

        const prompt = `
Comprehensive Style Analysis Request:

User Image Analysis:
${JSON.stringify(extracted, null, 2)}

Please provide a detailed style analysis including:

1. Skin Tone Analysis:
   - Undertone assessment
   - Best color matches
   - Colors to avoid

2. Color Palette Recommendations:
   - Professional colors
   - Casual colors
   - Evening/Formal colors
   - Seasonal palettes

3. Outfit Recommendations:
   - Professional/Work attire
   - Casual/Everyday outfits
   - Evening/Special occasion
   - Seasonal outfits

4. Style Tips:
   - Best necklines for face shape
   - Best patterns for body type
   - Accessory recommendations
   - Hair style suggestions

5. Shopping Guide:
   - Recommended clothing items
   - Stores/brands that would suit
   - Budget-friendly options

Respond in JSON format with proper structure.
        `;

        const geminiResponse = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBv_-6HxbmCygVXNAsBJ-q5o6c6G6xNMd0",
          {
            contents: [{ parts: [{ text: prompt }] }],
          }
        );

        const geminiText =
          geminiResponse.data.candidates[0].content.parts[0].text;
        const cleanedText = cleanGeminiResponse(geminiText);

        const geminiJson = JSON.parse(cleanedText);

        // Clean up the uploaded file
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });

        res.json({
          imageAnalysis: extracted,
          styleRecommendations: geminiJson,
        });
      } catch (error) {
        console.error("Processing error:", error);
        res.status(500).json({
          error: "Processing failed",
          details: error.message,
        });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
