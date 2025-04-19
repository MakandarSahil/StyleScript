
import { createFileRoute, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import ClothViewer from "../../components/ClothViewer"
import { Loader2, Download, Share2, Save, Undo2 } from "lucide-react"

export const Route = createFileRoute("/catalog/$clothId")({
  
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      model: search.model as string ?? "/models/shirt_full.glb"
    }
  }
})

function RouteComponent() {
  const [sleeveType, setSleeveType] = useState<"full" | "half">("full")
  const [color, setColor] = useState<string>("#3B82F6")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("customize")
  const [brightness, setBrightness] = useState<number>(100)
  const [recentColors, setRecentColors] = useState<string[]>(["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"])

  // Adjust color brightness
  const adjustedColor = adjustColorBrightness(color, brightness)

  const { model } = useSearch({ from: "/catalog/$clothId" }) as { model: string }

  // Replace hardcoded path with dynamic one
  const modelPath = model ?? "/models/shirt_full.glb"

  const handleGenerateImage = () => {
    setIsLoading(true)
    setActiveTab("preview")

    setTimeout(() => {
      setIsLoading(false)
      // Additional logic for image generation would go here
    }, 1500)
  }

  const handleColorSelect = (newColor: string) => {
    setColor(newColor)

    // Add to recent colors if not already there
    if (!recentColors.includes(newColor)) {
      setRecentColors((prev) => [newColor, ...prev.slice(0, 4)])
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">3D Clothing Customizer</h1>
          <p className="text-gray-600 mt-2">Design your perfect shirt with our interactive 3D customizer</p>
        </header>

        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/2 lg:w-3/5 h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gray-50 relative">
              <ClothViewer modelPath={modelPath} color="#3B82F6" />

                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                      <p className="mt-4 text-lg font-medium">Generating your design...</p>
                    </div>
                  </div>
                )}

                {activeTab === "preview" && !isLoading && (
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <button className="bg-white/90 backdrop-blur-sm px-3 py-2 text-sm rounded-md shadow hover:bg-white transition flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm px-3 py-2 text-sm rounded-md shadow hover:bg-white transition flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6 md:p-8 sm:w-1/2 lg:w-2/5">
                <div className="flex w-full mb-6 border rounded-lg overflow-hidden">
                  <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === "customize" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => setActiveTab("customize")}
                  >
                    Customize
                  </button>
                  <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === "preview" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => setActiveTab("preview")}
                  >
                    Preview
                  </button>
                </div>

                {activeTab === "customize" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Sleeve Style</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className={`
                            border rounded-md py-3 px-3 flex flex-col items-center justify-center text-sm font-medium h-16
                            ${sleeveType === "full" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"}
                          `}
                          onClick={() => setSleeveType("full")}
                        >
                          <span>Full Sleeve</span>
                          <span className="text-xs mt-1 opacity-70">Classic fit</span>
                        </button>
                        <button
                          type="button"
                          className={`
                            border rounded-md py-3 px-3 flex flex-col items-center justify-center text-sm font-medium h-16
                            ${sleeveType === "half" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"}
                          `}
                          onClick={() => setSleeveType("half")}
                        >
                          <span>Half Sleeve</span>
                          <span className="text-xs mt-1 opacity-70">Casual style</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {recentColors.map((recentColor) => (
                          <button
                            key={recentColor}
                            onClick={() => handleColorSelect(recentColor)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              color === recentColor ? "border-gray-900 scale-110" : "border-gray-200"
                            }`}
                            style={{ backgroundColor: recentColor }}
                            aria-label={`Select color ${recentColor}`}
                          />
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-gray-200 overflow-hidden">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorSelect(e.target.value)}
                            className="w-10 h-10 transform translate-x-[-4px] translate-y-[-4px] cursor-pointer"
                            aria-label="Custom color picker"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Brightness</span>
                          <span className="text-sm text-gray-600">{brightness}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          step="1"
                          value={brightness}
                          onChange={(e) => setBrightness(Number.parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        className={`
                          w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-12
                          ${isLoading ? "opacity-80 cursor-not-allowed" : ""}
                        `}
                        onClick={handleGenerateImage}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Generate Design"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "preview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Your Design</h3>
                      <p className="text-gray-600">
                        Here's your customized shirt design. You can download it or share it with friends.
                      </p>

                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Design Details</h4>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>Sleeve: {sleeveType === "full" ? "Full Sleeve" : "Half Sleeve"}</p>
                              <div className="flex items-center">
                                <span>Color:</span>
                                <div
                                  className="ml-2 w-4 h-4 rounded-full"
                                  style={{ backgroundColor: adjustedColor }}
                                ></div>
                                <span className="ml-1 text-xs">{adjustedColor}</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            3D Model
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-md py-2 px-4 flex items-center justify-center"
                        onClick={() => setActiveTab("customize")}
                      >
                        <Undo2 className="mr-2 h-4 w-4" />
                        Edit Design
                      </button>
                      <button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 flex items-center justify-center">
                        <Save className="mr-2 h-4 w-4" />
                        Save Design
                      </button>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Recommended Products</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
                          <div className="aspect-square bg-gray-100 rounded-md mb-2"></div>
                          <p className="text-xs font-medium truncate">Premium Cotton Shirt</p>
                          <p className="text-xs text-gray-500">$39.99</p>
                        </div>
                        <div className="p-2 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
                          <div className="aspect-square bg-gray-100 rounded-md mb-2"></div>
                          <p className="text-xs font-medium truncate">Graphic Print Tee</p>
                          <p className="text-xs text-gray-500">$24.99</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 3D Clothing Customizer. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-700">
              Terms
            </a>
            <a href="#" className="hover:text-gray-700">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-700">
              Help
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, brightness: number): string {
  // Remove the # if present
  hex = hex.replace("#", "")

  // Parse the hex color
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  // Adjust brightness (100 is normal)
  const factor = brightness / 100

  // Ensure values stay within 0-255 range
  const adjustR = Math.min(255, Math.max(0, Math.round(r * factor)))
  const adjustG = Math.min(255, Math.max(0, Math.round(g * factor)))
  const adjustB = Math.min(255, Math.max(0, Math.round(b * factor)))

  // Convert back to hex
  return `#${adjustR.toString(16).padStart(2, "0")}${adjustG.toString(16).padStart(2, "0")}${adjustB.toString(16).padStart(2, "0")}`
}

export default RouteComponent

