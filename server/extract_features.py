#!/usr/bin/env python3
"""
Enhanced Feature Extraction for Style Analysis - Simplified Version
Extracts comprehensive facial and color features from uploaded images
"""

import sys
import json
import cv2
import numpy as np
from PIL import Image
import colorsys
from sklearn.cluster import KMeans

# Try to import optional dependencies
try:
    import mediapipe as mp
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False
    print("Warning: MediaPipe not available, using basic analysis", file=sys.stderr)

class StyleAnalyzer:
    def __init__(self):
        if MEDIAPIPE_AVAILABLE:
            # Initialize MediaPipe Face Detection and Face Mesh
            self.mp_face_detection = mp.solutions.face_detection
            self.mp_face_mesh = mp.solutions.face_mesh
            
            self.face_detection = self.mp_face_detection.FaceDetection(
                model_selection=1, min_detection_confidence=0.5
            )
            self.face_mesh = self.mp_face_mesh.FaceMesh(
                static_image_mode=True,
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=0.5
            )
        else:
            # Use OpenCV's basic face detection as fallback
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    def extract_dominant_colors(self, image, k=5):
        """Extract dominant colors from image using K-means clustering"""
        try:
            # Convert image to RGB
            if len(image.shape) == 3:
                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            else:
                image_rgb = image
            
            # Reshape image to be a list of pixels
            data = image_rgb.reshape((-1, 3))
            data = np.float32(data)
            
            # Apply K-means clustering
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
            _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            # Convert back to uint8
            centers = np.uint8(centers)
            
            # Count occurrences of each cluster
            unique_labels, counts = np.unique(labels, return_counts=True)
            
            # Sort by frequency
            sorted_indices = np.argsort(counts)[::-1]
            dominant_colors = []
            
            for i in sorted_indices:
                color_rgb = centers[i]
                color_name = self.get_basic_color_name(color_rgb)
                dominant_colors.append({
                    'rgb': color_rgb.tolist(),
                    'hex': '#{:02x}{:02x}{:02x}'.format(color_rgb[0], color_rgb[1], color_rgb[2]),
                    'name': color_name,
                    'frequency': float(counts[i] / len(labels))
                })
            
            return dominant_colors
        except Exception as e:
            print(f"Error in color extraction: {e}", file=sys.stderr)
            return []
    
    def get_basic_color_name(self, rgb_color):
        """Basic color name detection using color ranges"""
        r, g, b = rgb_color
        
        # Normalize to 0-1 range for HSV conversion
        h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
        h_degrees = h * 360
        
        # Basic color classification based on HSV
        if v < 0.2:  # Very dark
            return "black"
        elif v > 0.9 and s < 0.1:  # Very light with low saturation
            return "white"
        elif s < 0.1:  # Low saturation (grayscale)
            if v > 0.7:
                return "light gray"
            elif v > 0.3:
                return "gray"
            else:
                return "dark gray"
        else:  # Colored
            if h_degrees < 15 or h_degrees > 345:
                return "red"
            elif 15 <= h_degrees < 45:
                return "orange"
            elif 45 <= h_degrees < 75:
                return "yellow"
            elif 75 <= h_degrees < 150:
                return "green"
            elif 150 <= h_degrees < 210:
                return "cyan"
            elif 210 <= h_degrees < 270:
                return "blue"
            elif 270 <= h_degrees < 330:
                return "purple"
            else:
                return "pink"
    
    def detect_skin_tone_basic(self, face_region):
        """Basic skin tone analysis from face region"""
        try:
            # Get average color of face region
            avg_color_bgr = np.mean(face_region, axis=(0, 1))
            avg_color_rgb = avg_color_bgr[::-1]  # Convert BGR to RGB
            
            # Classify skin tone
            skin_tone_category = self.classify_skin_tone(avg_color_rgb)
            undertone = self.detect_undertone(avg_color_rgb)
            
            return {
                'category': skin_tone_category,
                'rgb': avg_color_rgb.astype(int).tolist(),
                'hex': '#{:02x}{:02x}{:02x}'.format(int(avg_color_rgb[0]), int(avg_color_rgb[1]), int(avg_color_rgb[2])),
                'undertone': undertone
            }
        except Exception as e:
            print(f"Error in skin tone detection: {e}", file=sys.stderr)
            return {
                'category': 'medium',
                'rgb': [150, 120, 100],
                'hex': '#96786e',
                'undertone': 'neutral'
            }
    
    def classify_skin_tone(self, rgb_color):
        """Classify skin tone based on RGB values"""
        r, g, b = rgb_color
        
        # Calculate luminance
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        
        if luminance < 80:
            return "deep"
        elif luminance < 120:
            return "dark"
        elif luminance < 160:
            return "medium"
        elif luminance < 200:
            return "light medium"
        else:
            return "light"
    
    def detect_undertone(self, rgb_color):
        """Detect undertone (warm, cool, neutral) based on color analysis"""
        r, g, b = rgb_color
        
        # Convert to HSV for better undertone detection
        h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
        h_degrees = h * 360
        
        # Simple undertone detection
        if (r > g and r > b) or (30 <= h_degrees <= 60):  # Red-yellow dominance
            return "warm"
        elif (b > r and b > g) or (180 <= h_degrees <= 240):  # Blue dominance
            return "cool"
        else:
            return "neutral"
    
    def detect_face_with_mediapipe(self, image):
        """Detect face using MediaPipe"""
        try:
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            face_results = self.face_detection.process(rgb_image)
            mesh_results = self.face_mesh.process(rgb_image)
            
            if face_results.detections:
                detection = face_results.detections[0]
                bbox = detection.location_data.relative_bounding_box
                
                height, width = image.shape[:2]
                x = int(bbox.xmin * width)
                y = int(bbox.ymin * height)
                w = int(bbox.width * width)
                h = int(bbox.height * height)
                
                face_landmarks = None
                if mesh_results.multi_face_landmarks:
                    face_landmarks = mesh_results.multi_face_landmarks[0]
                
                return (x, y, w, h), face_landmarks
            
            return None, None
        except Exception as e:
            print(f"MediaPipe face detection error: {e}", file=sys.stderr)
            return None, None
    
    def detect_face_with_opencv(self, image):
        """Fallback face detection using OpenCV"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) > 0:
                x, y, w, h = faces[0]  # Take the first face
                return (x, y, w, h), None
            
            return None, None
        except Exception as e:
            print(f"OpenCV face detection error: {e}", file=sys.stderr)
            return None, None
    
    def determine_color_season(self, skin_tone, undertone):
        """Determine color season based on features"""
        undertone_lower = undertone.lower()
        skin_category = skin_tone.get('category', 'medium').lower()
        
        if undertone_lower == 'warm':
            if 'light' in skin_category:
                return "spring"
            else:
                return "autumn"
        elif undertone_lower == 'cool':
            if 'light' in skin_category:
                return "summer"
            else:
                return "winter"
        else:  # neutral
            return "soft summer"
    
    def generate_suitable_colors(self, color_season):
        """Generate suitable color palette based on season"""
        color_palettes = {
            "spring": ["coral", "peach", "golden yellow", "turquoise", "warm pink", "light green", "ivory", "warm red"],
            "summer": ["soft blue", "lavender", "rose pink", "mint green", "powder blue", "mauve", "soft white", "berry"],
            "autumn": ["rust", "golden brown", "deep orange", "olive green", "burgundy", "mustard", "cream", "terracotta"],
            "winter": ["true red", "royal blue", "emerald green", "hot pink", "black", "pure white", "navy", "magenta"],
            "soft summer": ["dusty rose", "soft teal", "muted purple", "sage green", "soft gray", "cream", "taupe", "lavender gray"]
        }
        
        return color_palettes.get(color_season, ["navy", "gray", "cream", "burgundy", "black", "white"])
    
    def analyze_image(self, image_path):
        """Main function to analyze image and extract all features"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Detect face
            if MEDIAPIPE_AVAILABLE:
                face_bbox, face_landmarks = self.detect_face_with_mediapipe(image)
            else:
                face_bbox, face_landmarks = self.detect_face_with_opencv(image)
            
            if face_bbox is None:
                # If no face detected, analyze whole image for colors
                print("No face detected, using whole image for analysis", file=sys.stderr)
                x, y, w, h = 0, 0, image.shape[1], image.shape[0]
                face_region = image
            else:
                x, y, w, h = face_bbox
                # Extract face region with some padding
                padding = 20
                y1 = max(0, y - padding)
                y2 = min(image.shape[0], y + h + padding)
                x1 = max(0, x - padding)
                x2 = min(image.shape[1], x + w + padding)
                face_region = image[y1:y2, x1:x2]
            
            # Analyze skin tone
            skin_tone = self.detect_skin_tone_basic(face_region)
            
            # Extract dominant colors from entire image
            dominant_colors = self.extract_dominant_colors(image, k=6)
            
            # Determine color season and suitable colors
            color_season = self.determine_color_season(skin_tone, skin_tone['undertone'])
            suitable_colors = self.generate_suitable_colors(color_season)
            
            # Analyze hair and eye colors from dominant colors
            hair_color = self.estimate_hair_color(dominant_colors)
            eye_color = self.estimate_eye_color(dominant_colors)
            
            # Determine face shape (basic estimation)
            face_shape = self.estimate_face_shape(w, h)
            
            # Convert all numpy types to native Python types
            def convert_numpy_types(obj):
                if isinstance(obj, (np.integer, np.floating)):
                    return int(obj) if isinstance(obj, np.integer) else float(obj)
                elif isinstance(obj, np.ndarray):
                    return obj.tolist()
                elif isinstance(obj, dict):
                    return {k: convert_numpy_types(v) for k, v in obj.items()}
                elif isinstance(obj, (list, tuple)):
                    return [convert_numpy_types(x) for x in obj]
                return obj
        
            # Compile results
            features = {
                "skinTone": skin_tone['category'],
                "skinToneRGB": skin_tone['rgb'],
                "skinUndertone": skin_tone['undertone'],
                "hairColor": hair_color['name'],
                "hairColorRGB": hair_color['rgb'],
                "eyeColor": eye_color['name'],
                "eyeColorRGB": eye_color['rgb'],
                "faceShape": face_shape,
                "colorSeason": color_season,
                "suitableColors": suitable_colors,
                "dominantColors": dominant_colors[:5],
                "gender": "unspecified",
                "ageGroup": "adult",
                "facialFeatures": {
                    "faceWidth": w,
                    "faceHeight": h,
                    "faceArea": w * h,
                    "aspectRatio": round(w / h, 2) if h > 0 else 1.0
                }
            }
            
            return features
            
        except Exception as e:
            print(f"Analysis error: {e}", file=sys.stderr)
            # Return safe default values
            return {
                "skinTone": "medium",
                "skinToneRGB": [150, 120, 100],
                "skinUndertone": "neutral",
                "hairColor": "brown",
                "hairColorRGB": [101, 67, 33],
                "eyeColor": "brown",
                "eyeColorRGB": [101, 67, 33],
                "faceShape": "oval",
                "colorSeason": "soft summer",
                "suitableColors": ["navy", "gray", "cream", "burgundy", "black", "white"],
                "dominantColors": [],
                "gender": "unspecified",
                "ageGroup": "adult",
                "facialFeatures": {"error": str(e)}
            }
    
    def estimate_hair_color(self, dominant_colors):
        """Estimate hair color from dominant colors"""
        # Look for darker colors that might be hair
        hair_candidates = [color for color in dominant_colors if self.is_hair_color(color['rgb'])]
        
        if hair_candidates:
            return hair_candidates[0]  # Most frequent hair-like color
        
        # Default hair color
        return {'rgb': [101, 67, 33], 'hex': '#654321', 'name': 'brown', 'frequency': 0.1}
    
    def estimate_eye_color(self, dominant_colors):
        """Estimate eye color from dominant colors"""
        # Look for colors that might be eyes
        eye_candidates = [color for color in dominant_colors if self.is_eye_color(color['rgb'])]
        
        if eye_candidates:
            return eye_candidates[0]
        
        # Default eye color
        return {'rgb': [101, 67, 33], 'hex': '#654321', 'name': 'brown', 'frequency': 0.05}
    
    def is_hair_color(self, rgb):
        """Check if RGB values are typical for hair"""
        r, g, b = rgb
        # Hair colors are typically darker and in brown/black/blonde range
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        return luminance < 120 and (abs(r - g) < 50 and abs(g - b) < 50)  # Not too colorful
    
    def is_eye_color(self, rgb):
        """Check if RGB values are typical for eyes"""
        r, g, b = rgb
        # Eyes can be various colors but usually have some saturation
        h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
        return 0.1 < s < 0.9 and 0.2 < v < 0.8  # Some saturation, not too dark/light
    
    def estimate_face_shape(self, width, height):
        """Estimate face shape based on width/height ratio"""
        if height == 0:
            return "oval"
        
        ratio = width / height
        
        if ratio > 1.2:
            return "round"
        elif ratio < 0.75:
            return "long"
        elif 0.9 <= ratio <= 1.1:
            return "square"
        else:
            return "oval"

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python extract_features.py <image_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        analyzer = StyleAnalyzer()
        features = analyzer.analyze_image(image_path)
        print(json.dumps(features))
    except Exception as e:
        print(f"Critical error: {e}", file=sys.stderr)
        error_response = {
            "error": f"Failed to analyze image: {str(e)}",
            "skinTone": "medium",
            "skinToneRGB": [150, 120, 100],
            "skinUndertone": "neutral",
            "hairColor": "brown",
            "hairColorRGB": [101, 67, 33],
            "eyeColor": "brown",
            "eyeColorRGB": [101, 67, 33],
            "faceShape": "oval",
            "colorSeason": "soft summer",
            "suitableColors": ["navy", "gray", "cream", "burgundy"],
            "dominantColors": [],
            "gender": "unspecified",
            "ageGroup": "adult",
            "facialFeatures": {}
        }
        print(json.dumps(error_response))

if __name__ == "__main__":
    main()