# extract_features.py
import sys
import json
from PIL import Image

def detect_skin_tone(image_path):
    return "medium warm"  # Simulated

def generate_suitable_colors(skin_tone):
    tones = {
        "medium warm": ["mustard", "olive green", "turquoise", "rust"],
        "fair cool": ["blue", "lavender", "pink"],
    }
    return tones.get(skin_tone, ["black", "white"])

image_path = sys.argv[1]

# Simulated extracted features
features = {
    "skinTone": detect_skin_tone(image_path),
    "gender": "female",
    "hairColor": "dark brown",
    "eyeColor": "hazel",
    "faceShape": "oval",
    "bodyShape": "pear",
    "ageGroup": "20-25",
}

features["suitableColors"] = generate_suitable_colors(features["skinTone"])

print(json.dumps(features))
