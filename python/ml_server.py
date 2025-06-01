from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from typing import Dict, List
import requests
import os
from pydantic import BaseModel
from dotenv import load_dotenv
import webcolors
from sklearn.cluster import KMeans

load_dotenv()

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API configuration
GEMINI_API_KEY = os.getenv("AIzaSyBv_-6HxbmCygVXNAsBJ-q5o6c6G6xNMd0")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"

class AnalysisRequest(BaseModel):
    skin_tone: str
    skin_undertone: str
    face_shape: str
    hair_color: str
    eye_color: str
    gender: str
    age_group: str
    current_style: str
    accessories: List[str]
    dominant_colors: List[str]

class GeminiResponse(BaseModel):
    skin_analysis: str
    style_recommendations: str
    outfit_suggestions: str
    color_combinations: str
    personalized_tips: str
    seasonal_advice: str
    shopping_guide: str

# Enhanced skin tone detection
def detect_skin_properties(img: np.ndarray, face_region: tuple) -> Dict:
    x, y, w, h = face_region
    face_roi = img[y:y+h, x:x+w]
    
    # Convert to different color spaces for analysis
    hsv = cv2.cvtColor(face_roi, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(face_roi, cv2.COLOR_BGR2LAB)
    
    # Skin tone detection
    avg_bgr = np.mean(face_roi, axis=(0, 1))
    hex_color = "#{:02x}{:02x}{:02x}".format(*avg_bgr.astype(int))
    
    # Undertone detection (simple approach)
    b, g, r = avg_bgr
    if r > g and r > b and (r - g) > 10:
        undertone = "warm"
    elif b > g and b > r and (b - g) > 5:
        undertone = "cool"
    else:
        undertone = "neutral"
    
    # Dominant colors
    pixels = face_roi.reshape(-1, 3)
    kmeans = KMeans(n_clusters=3, n_init=10)
    kmeans.fit(pixels)
    dominant_colors = ["#%02x%02x%02x" % tuple(color) for color in kmeans.cluster_centers_.astype(int)]
    
    return {
        "skin_tone_hex": hex_color,
        "undertone": undertone,
        "dominant_colors": dominant_colors
    }

# Face shape detection (simplified)
def detect_face_shape(face_region: tuple) -> str:
    x, y, w, h = face_region
    ratio = w / h
    
    if ratio > 0.9:
        return "round"
    elif ratio < 0.75:
        return "oval"
    elif w > h:
        return "square"
    else:
        return "heart"

# Hair color detection (simplified)
def detect_hair_color(img: np.ndarray, face_region: tuple) -> str:
    x, y, w, h = face_region
    hair_region = img[max(0, y-int(h*0.5)):y, x:x+w]  # Area above face
    
    if hair_region.size == 0:
        return "unknown"
    
    avg_color = np.mean(hair_region, axis=(0, 1))
    b, g, r = avg_color
    
    if r > 180 and g > 150 and b < 100:
        return "blonde"
    elif r > 150 and g > 100 and b > 100:
        return "brown"
    elif r < 50 and g < 50 and b < 50:
        return "black"
    elif r > 150 and g < 100 and b < 100:
        return "red"
    else:
        return "unknown"

async def get_gemini_recommendations(analysis_data: Dict) -> Dict:
    prompt = f"""
    Based on the following personal style analysis, provide comprehensive fashion recommendations:
    
    Skin Tone: {analysis_data['skin_tone']}
    Skin Undertone: {analysis_data['skin_undertone']}
    Face Shape: {analysis_data['face_shape']}
    Hair Color: {analysis_data['hair_color']}
    Eye Color: {analysis_data['eye_color']}
    Gender: {analysis_data['gender']}
    Age Group: {analysis_data['age_group']}
    Current Style: {analysis_data['current_style']}
    Accessories: {', '.join(analysis_data['accessories'])}
    Dominant Colors: {', '.join(analysis_data['dominant_colors'])}
    
    Provide recommendations in the following structure:
    1. Skin Analysis Results - Detailed analysis of skin properties and what they mean for fashion choices
    2. Style Recommendations - Fashion styles that would complement the person's features
    3. Outfit Suggestions - Specific outfit ideas for different occasions
    4. Color Combinations - Flattering color palettes and combinations
    5. Personalized Tips - Custom grooming and styling advice
    6. Seasonal Advice - Seasonal wardrobe recommendations
    7. Shopping Guide - Suggested items to purchase to implement these recommendations
    
    Make the response detailed, practical, and personalized.
    """
    
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    response = requests.post(GEMINI_URL, json=data, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Gemini API request failed")
    
    try:
        gemini_response = response.json()
        content = gemini_response['candidates'][0]['content']['parts'][0]['text']
        return parse_gemini_response(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse Gemini response: {str(e)}")

def parse_gemini_response(text: str) -> Dict:
    # This is a simplified parser - you might want to enhance it
    sections = {
        "skin_analysis": "",
        "style_recommendations": "",
        "outfit_suggestions": "",
        "color_combinations": "",
        "personalized_tips": "",
        "seasonal_advice": "",
        "shopping_guide": ""
    }
    
    current_section = None
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        if "1. Skin Analysis Results" in line:
            current_section = "skin_analysis"
        elif "2. Style Recommendations" in line:
            current_section = "style_recommendations"
        elif "3. Outfit Suggestions" in line:
            current_section = "outfit_suggestions"
        elif "4. Color Combinations" in line:
            current_section = "color_combinations"
        elif "5. Personalized Tips" in line:
            current_section = "personalized_tips"
        elif "6. Seasonal Advice" in line:
            current_section = "seasonal_advice"
        elif "7. Shopping Guide" in line:
            current_section = "shopping_guide"
        elif current_section:
            sections[current_section] += line + "\n"
    
    return sections

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    # Detect faces
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No face detected in the image")
    
    # For simplicity, use the first face
    face = faces[0]
    
    # Extract features
    skin_properties = detect_skin_properties(img, face)
    face_shape = detect_face_shape(face)
    hair_color = detect_hair_color(img, face)
    
    # Prepare analysis data for Gemini
    analysis_data = {
        "skin_tone": skin_properties["skin_tone_hex"],
        "skin_undertone": skin_properties["undertone"],
        "face_shape": face_shape,
        "hair_color": hair_color,
        "eye_color": "unknown",  # Would need eye detection
        "gender": "unknown",      # Would need gender detection
        "age_group": "adult",     # Would need age estimation
        "current_style": "unknown",
        "accessories": [],
        "dominant_colors": skin_properties["dominant_colors"]
    }
    
    # Get recommendations from Gemini
    try:
        gemini_recommendations = await get_gemini_recommendations(analysis_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "skin_analysis": {
            "skin_tone_hex": skin_properties["skin_tone_hex"],
            "undertone": skin_properties["undertone"],
            "dominant_colors": skin_properties["dominant_colors"]
        },
        "recommendations": gemini_recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)