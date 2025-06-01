// import React, { useState } from "react";
// import { Upload, Image, Palette, Sparkles, FileImage, Loader2, Check, AlertCircle } from "lucide-react";

// function App() {
//   const [file, setFile] = useState<File | null>(null);
//   const [imageURL, setImageURL] = useState<string | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [dragOver, setDragOver] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResult(data);
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Upload failed. Is the backend running?");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null;
//     setFile(selectedFile);
//     if (selectedFile) {
//       setImageURL(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type.startsWith('image/')) {
//       setFile(droppedFile);
//       setImageURL(URL.createObjectURL(droppedFile));
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//   };

//   // Helper function to format feature names
//   const formatFeatureName = (name: string) => {
//     return name
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, str => str.toUpperCase())
//       .replace('RGB', ' (RGB)');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
//               <Sparkles className="w-6 h-6" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                 Style AI Assistant
//               </h1>
//               <p className="text-sm text-gray-500">Advanced image analysis and color recommendation</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Upload Section */}
//         <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
//           <div className="text-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Your Image</h2>
//             <p className="text-gray-600">Drag and drop or click to select an image for analysis</p>
//           </div>

//           <div
//             className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group hover:border-blue-400 hover:bg-blue-50/50 ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//               }`}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onClick={() => document.getElementById('file-input')?.click()}
//           >
//             <input
//               id="file-input"
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="hidden"
//             />

//             <div className="flex flex-col items-center gap-4">
//               {imageURL ? (
//                 <div className="relative">
//                   <img
//                     src={imageURL}
//                     alt="Preview"
//                     className="max-w-xs max-h-48 rounded-xl shadow-lg border-4 border-white"
//                   />
//                   <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
//                     <Check className="w-4 h-4" />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl">
//                   <Upload className="w-12 h-12 text-blue-500 mx-auto" />
//                 </div>
//               )}

//               <div>
//                 <p className="text-lg font-medium text-gray-700">
//                   {file ? file.name : 'Choose an image file'}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {file ? 'Ready for analysis' : 'PNG, JPG, GIF up to 10MB'}
//                 </p>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleUpload();
//                 }}
//                 disabled={!file || loading}
//                 className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 hover:scale-105"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Analyzing...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="w-5 h-5" />
//                     Analyze Image
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Results Section */}
//         {result && (
//           <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
//             {/* Features Grid */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
//                   <Image className="w-5 h-5" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800">Extracted Features</h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {Object.entries(result.extractedFeatures).map(([key, value]) => {
//                   // Skip these complex objects as they have their own sections
//                   if (key === "suitableColors" || key === "dominantColors" || key === "facialFeatures") {
//                     return null;
//                   }

//                   return (
//                     <div key={key} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
//                       <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
//                         {formatFeatureName(key)}
//                       </div>
//                       <div className="text-lg font-semibold text-gray-800">
//                         {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Facial Features */}
//               {result.extractedFeatures.facialFeatures && (
//                 <div className="mt-6">
//                   <h4 className="text-md font-semibold text-gray-700 mb-3">Facial Features</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {Object.entries(result.extractedFeatures.facialFeatures).map(([key, value]) => (
//                       <div key={key} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
//                         <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
//                           {formatFeatureName(key)}
//                         </div>
//                         <div className="text-lg font-semibold text-gray-800">
//                           {String(value)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Color Palette */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white">
//                   <Palette className="w-5 h-5" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800">Color Palette</h3>
//               </div>

//               <div className="mb-8">
//                 <h4 className="text-md font-semibold text-gray-700 mb-3">Suitable Colors</h4>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
//                   {result.extractedFeatures.suitableColors.map((color: string, i: number) => (
//                     <div
//                       key={`suitable-${i}`}
//                       className="group cursor-pointer hover:scale-110 transition-all duration-300"
//                     >
//                       <div
//                         className="aspect-square rounded-2xl shadow-lg border-4 border-white group-hover:shadow-xl transition-shadow duration-300"
//                         style={{ backgroundColor: color }}
//                       />
//                       <div className="text-center mt-2 text-sm font-mono text-gray-600 group-hover:text-gray-800 transition-colors">
//                         {color}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h4 className="text-md font-semibold text-gray-700 mb-3">Dominant Colors in Image</h4>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                   {result.extractedFeatures.dominantColors.map((color: any, i: number) => (
//                     <div
//                       key={`dominant-${i}`}
//                       className="group cursor-pointer hover:scale-110 transition-all duration-300"
//                     >
//                       <div
//                         className="aspect-square rounded-2xl shadow-lg border-4 border-white group-hover:shadow-xl transition-shadow duration-300"
//                         style={{ backgroundColor: color.hex }}
//                       />
//                       <div className="text-center mt-2 space-y-1">
//                         <div className="text-sm font-mono text-gray-600 group-hover:text-gray-800 transition-colors">
//                           {color.hex}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {color.name} ({(color.frequency * 100).toFixed(1)}%)
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* AI Recommendations */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white">
//                   <Sparkles className="w-5 h-5" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800">AI Recommendations</h3>
//               </div>

//               <div className="space-y-8">
//                 {/* Skin Analysis */}
//                 <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Skin Analysis
//                   </h4>
//                   <div className="space-y-4">
//                     <p className="text-gray-700 leading-relaxed">
//                       {result.analysis.skinAnalysisResults.skinToneCategory}
//                     </p>
//                     <p className="text-gray-700 leading-relaxed">
//                       {result.analysis.skinAnalysisResults.undertoneAnalysis}
//                     </p>
//                     <p className="text-gray-700 leading-relaxed">
//                       {result.analysis.skinAnalysisResults.colorSeason}
//                     </p>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                       <div>
//                         <h5 className="font-medium text-gray-700 mb-2">Best Colors</h5>
//                         <div className="flex flex-wrap gap-2">
//                           {result.analysis.skinAnalysisResults.bestColors.map((color: string, i: number) => (
//                             <span key={`best-${i}`} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                               {color}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                       <div>
//                         <h5 className="font-medium text-gray-700 mb-2">Colors to Avoid</h5>
//                         <div className="flex flex-wrap gap-2">
//                           {result.analysis.skinAnalysisResults.avoidColors.map((color: string, i: number) => (
//                             <span key={`avoid-${i}`} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                               {color}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Style Recommendations */}
//                 <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Style Recommendations
//                   </h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {Object.entries(result.analysis.styleRecommendations).map(([occasion, details]: [string, any]) => (
//                       <div key={occasion} className="space-y-3">
//                         <h5 className="font-medium text-gray-700 capitalize">{occasion}</h5>
//                         <div className="space-y-2">
//                           <h6 className="text-sm font-medium text-gray-600">Clothing:</h6>
//                           <ul className="space-y-1 pl-5 list-disc text-gray-700">
//                             {details.clothing.map((item: string, i: number) => (
//                               <li key={`${occasion}-clothing-${i}`}>{item}</li>
//                             ))}
//                           </ul>
//                         </div>
//                         <div className="space-y-2">
//                           <h6 className="text-sm font-medium text-gray-600">Colors:</h6>
//                           <div className="flex flex-wrap gap-2">
//                             {details.colors.map((color: string, i: number) => (
//                               <span key={`${occasion}-color-${i}`} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                                 {color}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <h6 className="text-sm font-medium text-gray-600">Accessories:</h6>
//                           <ul className="space-y-1 pl-5 list-disc text-gray-700">
//                             {details.accessories.map((item: string, i: number) => (
//                               <li key={`${occasion}-accessory-${i}`}>{item}</li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Color Combinations */}
//                 <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Color Combinations
//                   </h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {Object.entries(result.analysis.colorCombinations).map(([type, combinations]: [string, any]) => (
//                       <div key={type} className="space-y-2">
//                         <h5 className="font-medium text-gray-700 capitalize">{type} Combinations</h5>
//                         <ul className="space-y-1 pl-5 list-disc text-gray-700">
//                           {combinations.map((combo: string, i: number) => (
//                             <li key={`${type}-${i}`}>{combo}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Personalized Tips */}
//                 <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Personalized Tips
//                   </h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {Object.entries(result.analysis.personalizedTips).map(([category, tips]: [string, any]) => (
//                       <div key={category} className="space-y-2">
//                         <h5 className="font-medium text-gray-700 capitalize">{category}</h5>
//                         <ul className="space-y-1 pl-5 list-disc text-gray-700">
//                           {Array.isArray(tips) ? (
//                             tips.map((tip: string, i: number) => (
//                               <li key={`${category}-${i}`}>{tip}</li>
//                             ))
//                           ) : (
//                             <li>{String(tips)}</li>
//                           )}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Seasonal Advice */}
//                 <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Seasonal Advice
//                   </h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {Object.entries(result.analysis.seasonalAdvice).map(([season, advice]: [string, any]) => (
//                       <div key={season} className="space-y-2">
//                         <h5 className="font-medium text-gray-700 capitalize">{season}</h5>
//                         <ul className="space-y-1 pl-5 list-disc text-gray-700">
//                           {Array.isArray(advice) ? (
//                             advice.map((item: string, i: number) => (
//                               <li key={`${season}-${i}`}>{item}</li>
//                             ))
//                           ) : (
//                             <li>{String(advice)}</li>
//                           )}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Shopping Guide */}
//                 <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Shopping Guide
//                   </h4>

//                   <div className="space-y-6">
//                     {Object.entries(result.analysis.shoppingGuide).map(([section, content]: [string, any]) => (
//                       <div key={section} className="space-y-2">
//                         <h5 className="font-medium text-gray-700 capitalize">{section}</h5>
//                         {Array.isArray(content) ? (
//                           <ul className="space-y-1 pl-5 list-disc text-gray-700">
//                             {content.map((item: string, i: number) => (
//                               <li key={`${section}-${i}`}>{item}</li>
//                             ))}
//                           </ul>
//                         ) : (
//                           <p className="text-gray-700">{String(content)}</p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Specific Recommendations */}
//                 <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Specific Recommendations
//                   </h4>

//                   <div className="space-y-4">
//                     {Object.entries(result.analysis.specificRecommendations).map(([category, advice]: [string, any]) => (
//                       <div key={category} className="space-y-2">
//                         <h5 className="font-medium text-gray-700 capitalize">{category}</h5>
//                         <p className="text-gray-700">{String(advice)}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
//             <div className="inline-flex items-center gap-4">
//               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">Analyzing Your Image</h3>
//                 <p className="text-gray-600 mt-1">AI is processing the visual elements...</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ModelPathProvider } from '@/context/ModelPathContext'


export default function App() {
  return (
    <React.Fragment>
      <ModelPathProvider>
        <AppRoutes />
      </ModelPathProvider>
    </React.Fragment>
  )
}
