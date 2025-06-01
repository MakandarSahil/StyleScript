import React, { useState } from 'react';
import axios from 'axios';

type SkinAnalysis = {
  skin_tone_hex: string;
  undertone: string;
  dominant_colors: string[];
};

type Recommendations = {
  skin_analysis: string;
  style_recommendations: string;
  outfit_suggestions: string;
  color_combinations: string;
  personalized_tips: string;
  seasonal_advice: string;
  shopping_guide: string;
};

type ApiResponse = {
  skin_analysis?: SkinAnalysis;
  recommendations?: Recommendations;
  error?: string;
};


const FashionAdvisor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('skinAnalysis');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<ApiResponse>('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("response", response.data);
      setResults(response.data);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const renderContent = () => {
    if (!results || !results.skin_analysis || !results.recommendations) {
      return null;
    }


    switch (activeTab) {
      case 'skinAnalysis':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Skin Analysis</h3>
            <div className="flex items-center space-x-6">
              <div
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: results.skin_analysis.skin_tone_hex }}
              />
              <div className="space-y-2">
                <p><span className="font-medium">Skin Tone:</span> {results.skin_analysis.skin_tone_hex}</p>
                <p><span className="font-medium">Undertone:</span> <span className="capitalize">{results.skin_analysis.undertone}</span></p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Dominant Colors</h4>
              <div className="flex space-x-2">
                {results.skin_analysis.dominant_colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="prose max-w-none">
              <h4 className="font-medium">Analysis Results</h4>
              <p className="whitespace-pre-line">{results.recommendations.skin_analysis}</p>
            </div>
          </div>
        );

      case 'styleRecommendations':
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Style Recommendations</h3>
            <p className="whitespace-pre-line">{results.recommendations.style_recommendations}</p>
          </div>
        );

      case 'outfitSuggestions':
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Outfit Suggestions</h3>
            <p className="whitespace-pre-line">{results.recommendations.outfit_suggestions}</p>
          </div>
        );

      case 'colorCombinations':
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Color Combinations</h3>
            <p className="whitespace-pre-line">{results.recommendations.color_combinations}</p>
          </div>
        );

      case 'personalizedTips':
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Personalized Tips</h3>
            <p className="whitespace-pre-line">{results.recommendations.personalized_tips}</p>
          </div>
        );

      case 'seasonalAdvice':
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Seasonal Advice</h3>
            <p className="whitespace-pre-line">{results.recommendations.seasonal_advice}</p>
          </div>
        );

      case 'shoppingGuide':
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Shopping Guide</h3>
            <p className="whitespace-pre-line">{results.recommendations.shopping_guide}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Personal Fashion Advisor</h1>

      <div className="mb-8">
        <label className="block mb-2 text-lg font-medium text-gray-700">
          Upload your photo for personalized fashion advice
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
          className="block w-full text-lg text-gray-500
            file:mr-4 file:py-3 file:px-6
            file:rounded-lg file:border-0
            file:text-lg file:font-semibold
            file:bg-blue-100 file:text-blue-700
            hover:file:bg-blue-200"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <span className="ml-4 text-lg">Analyzing your image...</span>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {image && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Your Photo</h3>
          <img
            src={image}
            alt="Preview"
            className="max-w-xs rounded-lg border border-gray-200 shadow-sm"
          />
        </div>
      )}

      {results && (
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('skinAnalysis')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'skinAnalysis' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Skin Analysis
              </button>
              <button
                onClick={() => setActiveTab('styleRecommendations')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'styleRecommendations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Style Recommendations
              </button>
              <button
                onClick={() => setActiveTab('outfitSuggestions')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'outfitSuggestions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Outfit Suggestions
              </button>
              <button
                onClick={() => setActiveTab('colorCombinations')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'colorCombinations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Color Combos
              </button>
              <button
                onClick={() => setActiveTab('personalizedTips')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'personalizedTips' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Personalized Tips
              </button>
              <button
                onClick={() => setActiveTab('seasonalAdvice')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'seasonalAdvice' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Seasonal Advice
              </button>
              <button
                onClick={() => setActiveTab('shoppingGuide')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shoppingGuide' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Shopping Guide
              </button>
            </nav>
          </div>

          <div className="py-6">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FashionAdvisor;