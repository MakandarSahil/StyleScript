// import React from 'react'
// import AppRoutes from './routes/AppRoutes'
// import { ModelPathProvider } from './context/ModelPathContext'


// export default function App() {
//   return (
//     <React.Fragment>
//       <ModelPathProvider>
//         <AppRoutes />
//       </ModelPathProvider>
//     </React.Fragment>
//   )
// }


// App.tsx
import React, { useState } from "react";
import { Upload, Image, Palette, Sparkles, FileImage, Loader2, Check, AlertCircle } from "lucide-react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    // Simulate API call for demo purposes
    setTimeout(() => {
      const mockResult = {
        features: {
          dominantColor: "#4A90E2",
          brightness: "Medium",
          contrast: "High",
          style: "Contemporary",
          suitableColors: ["#4A90E2", "#E74C3C", "#2ECC71", "#F39C12", "#9B59B6", "#1ABC9C"]
        },
        geminiResponse: {
          styleAnalysis: "This image shows a contemporary aesthetic with strong visual appeal and balanced composition.",
          colorPalette: {
            primary: "#4A90E2",
            secondary: "#E74C3C",
            accent: "#2ECC71"
          },
          recommendations: [
            "Consider using complementary colors for contrast",
            "The lighting creates excellent depth",
            "Color harmony suggests modern design principles"
          ],
          confidence: 0.94
        }
      };
      setResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setImageURL(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setImageURL(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Style AI Assistant
              </h1>
              <p className="text-sm text-gray-500">Advanced image analysis and color recommendation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Your Image</h2>
            <p className="text-gray-600">Drag and drop or click to select an image for analysis</p>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group hover:border-blue-400 hover:bg-blue-50/50 ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              {imageURL ? (
                <div className="relative">
                  <img
                    src={imageURL}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-xl shadow-lg border-4 border-white"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl">
                  <Upload className="w-12 h-12 text-blue-500 mx-auto" />
                </div>
              )}

              <div>
                <p className="text-lg font-medium text-gray-700">
                  {file ? file.name : 'Choose an image file'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {file ? 'Ready for analysis' : 'PNG, JPG, GIF up to 10MB'}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
            {/* Features Grid */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
                  <Image className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Extracted Features</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(result.features).map(([key, value]) =>
                  key === "suitableColors" ? null : (
                    <div key={key} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-lg font-semibold text-gray-800">{String(value)}</div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Color Palette</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {result.features.suitableColors.map((color: string, i: number) => (
                  <div
                    key={i}
                    className="group cursor-pointer hover:scale-110 transition-all duration-300"
                  >
                    <div
                      className="aspect-square rounded-2xl shadow-lg border-4 border-white group-hover:shadow-xl transition-shadow duration-300"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-center mt-2 text-sm font-mono text-gray-600 group-hover:text-gray-800 transition-colors">
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">AI Recommendations</h3>
              </div>

              <div className="space-y-6">
                {Object.entries(result.geminiResponse).map(([section, content]: [string, any]) => (
                  <div key={section} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>

                    {typeof content === "string" || typeof content === "number" ? (
                      <p className="text-gray-700 leading-relaxed">{content}</p>
                    ) : Array.isArray(content) ? (
                      <div className="space-y-2">
                        {content.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{typeof item === "object" ? JSON.stringify(item) : item}</span>
                          </div>
                        ))}
                      </div>
                    ) : typeof content === "object" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(content).map(([key, value], idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100">
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                              {key}
                            </div>
                            <div className="text-gray-800 font-medium">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700">{String(content)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="inline-flex items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Analyzing Your Image</h3>
                <p className="text-gray-600 mt-1">AI is processing the visual elements...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;