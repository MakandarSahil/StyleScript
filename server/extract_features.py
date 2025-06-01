import sys
import json
import cv2
import numpy as np
from PIL import Image
import colorsys

# Load OpenCV's Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def detect_skin_tone(image_path):
    """Detects skin tone from the face using OpenCV"""
    img = cv2.imread(image_path)
    if img is None:
        return "light warm"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        return "light warm"

    # Take the largest face
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

    # Sample skin from cheeks and forehead (avoiding eyes/mouth)
    cheek_left = img[y + h//3 : y + h//2, x + w//4 : x + w//2]
    cheek_right = img[y + h//3 : y + h//2, x + w//2 : x + 3*w//4]
    forehead = img[y : y + h//3, x + w//3 : x + 2*w//3]

    skin_pixels = np.vstack([cheek_left.reshape(-1, 3), 
                            cheek_right.reshape(-1, 3), 
                            forehead.reshape(-1, 3)])

    avg_color = np.mean(skin_pixels, axis=0)
    b, g, r = avg_color

    # Convert to HSV for tone analysis
    h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)

    # Classify skin tone
    if v < 0.25:
        tone = "dark"
    elif v < 0.6:
        tone = "medium"
    else:
        tone = "light"

    # Classify undertone (simplified)
    if h < 0.05 or h > 0.9:
        undertone = "warm"  # Reddish
    else:
        undertone = "cool"  # Yellowish/neutral

    return f"{tone} {undertone}"

def detect_hair_color(image_path):
    """Estimates hair color from the top of the face"""
    img = cv2.imread(image_path)
    if img is None:
        return "black"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        return "black"

    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

    # Extract hair region (above face)
    hair_region = img[max(0, y - h//2) : y, x : x + w]

    if hair_region.size == 0:
        return "black"

    # Get dominant color
    pixels = hair_region.reshape(-1, 3)
    avg_color = np.mean(pixels, axis=0)
    b, g, r = avg_color

    # Simple color classification
    if r > 180 and g < 100 and b < 100:
        return "red"
    elif r > 160 and g > 160 and b > 160:
        return "blonde"
    elif r < 50 and g < 50 and b < 50:
        return "black"
    else:
        return "brown"

def generate_suitable_colors(skin_tone):
    """Returns color recommendations based on skin tone"""
    palettes = {
        "light warm": ["peach", "coral", "gold", "olive green"],
        "light cool": ["powder blue", "lavender", "mint green"],
        "medium warm": ["mustard", "rust", "teal"],
        "medium cool": ["navy", "emerald", "plum"],
        "dark warm": ["gold", "orange-red", "turquoise"],
        "dark cool": ["royal blue", "fuchsia", "silver"]
    }
    return palettes.get(skin_tone, ["black", "white", "navy"])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image provided"}))
        sys.exit(1)

    try:
        features = {
            "skinTone": detect_skin_tone(sys.argv[1]),
            "hairColor": detect_hair_color(sys.argv[1]),
            "faceShape": "oval",  # Placeholder (OpenCV can't detect shape directly)
            "suitableColors": generate_suitable_colors(detect_skin_tone(sys.argv[1]))
        }
        print(json.dumps(features))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
