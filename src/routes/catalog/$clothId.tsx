// RouteComponent.tsx
import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import ClothViewer from "../../components/ClothViewer"
import { Loader2, Download, Share2, Save, Undo2, ShoppingCart, ArrowLeft, Heart } from "lucide-react"

export const Route = createFileRoute("/catalog/$clothId")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      model: search.model as string ?? "/models/shirt_full.glb"
    }
  }
})

function RouteComponent() {
  const [color, setColor] = useState<string>("#3B82F6")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("customize")
  const [brightness, setBrightness] = useState<number>(100)
  const [recentColors, setRecentColors] = useState<string[]>(["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"])
  const [addedToCart, setAddedToCart] = useState<boolean>(false)
  const [size, setSize] = useState<string>("M")
  const [quantity, setQuantity] = useState<number>(1)

  const navigate = useNavigate()
  const adjustedColor = adjustColorBrightness(color, brightness)
  const { model } = useSearch({ from: "/catalog/$clothId" }) as { model: string }
  const modelPath = model ?? "/models/shirt_full.glb"

  const handleGenerateImage = () => {
    setIsLoading(true)
    setActiveTab("preview")
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleColorSelect = (newColor: string) => {
    setColor(newColor)
    if (!recentColors.includes(newColor)) {
      setRecentColors((prev) => [newColor, ...prev.slice(0, 4)])
    }
  }

  const handleAddToCart = () => {
    setIsLoading(true)
    setTimeout(() => {
      setAddedToCart(true)
      setIsLoading(false)
    }, 800)
  }

  const handleBackToCatalog = () => {
    navigate({ to: "/catalog" })
  }

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center">
          <button
            onClick={handleBackToCatalog}
            className="mr-4 p-2 bg-white rounded-full shadow hover:shadow-md transition"
            aria-label="Back to catalog"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">3D Clothing Customizer</h1>
            <p className="text-gray-600 mt-2">Customize your selected clothing item</p>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
          <div className="w-full flex flex-col sm:flex-row">
            <div className="sm:w-1/2 lg:w-3/5 h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gray-50 relative">
              <ClothViewer modelPath={modelPath} color={adjustedColor} />
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="mt-4 text-lg font-medium">
                      {addedToCart ? "Adding to cart..." : "Generating your design..."}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "preview" && !isLoading && (
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  <button className="bg-white/90 px-3 py-2 text-sm rounded-md shadow hover:bg-white transition flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button className="bg-white/90 px-3 py-2 text-sm rounded-md shadow hover:bg-white transition flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button className="bg-white/90 px-3 py-2 text-sm rounded-md shadow hover:bg-white transition flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              )}
            </div>

            {/* Customization Sidebar */}
            <div className="p-4 sm:p-6 md:p-8 sm:w-1/2 lg:w-2/5">
              {/* Tabs */}
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
                  {/* Color Picker */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Color Selection</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recentColors.map((recentColor) => (
                        <button
                          key={recentColor}
                          onClick={() => handleColorSelect(recentColor)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${color === recentColor ? "border-gray-900 scale-110" : "border-gray-200"}`}
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
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-4">
                    <button
                      className={`w-full bg-blue-600 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 h-12 ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
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

              {/* Preview Tab */}
              {activeTab === "preview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Your Custom Design</h3>
                    <p className="text-gray-600">Here's your customized clothing item. You can order it now or make further adjustments.</p>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Design Details</h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span>Color:</span>
                              <div className="ml-2 w-4 h-4 rounded-full" style={{ backgroundColor: adjustedColor }}></div>
                              <span className="ml-1 text-xs">{adjustedColor}</span>
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">3D Model</span>
                      </div>
                    </div>

                    {/* Order Options */}
                    <div className="mt-6 border-t pt-6">
                      <h4 className="font-medium mb-4">Order Options</h4>

                      {/* Size Selector */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map((availableSize) => (
                            <button
                              key={availableSize}
                              type="button"
                              className={`py-2 px-3 text-sm border rounded-md transition ${availableSize === size
                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                : "border-gray-300 text-gray-700"
                                }`}
                              onClick={() => setSize(availableSize)}
                            >
                              {availableSize}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <div className="flex rounded-md">
                          <button
                            type="button"
                            className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-500"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 text-center border-y border-gray-300 py-2"
                          />
                          <button
                            type="button"
                            className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex justify-between items-center font-medium mb-6">
                        <span>Total Price:</span>
                        <span className="text-lg">${(29.99 * quantity).toFixed(2)}</span>
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

                    <button
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 rounded-md py-2 px-4 flex items-center justify-center"
                      onClick={handleAddToCart}
                      disabled={isLoading || addedToCart}
                    >
                      {addedToCart ? (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                  {addedToCart && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center">
                      <div className="flex-grow">
                        <p className="font-medium">Item added to your cart!</p>
                        <p className="text-sm">Your custom design has been saved.</p>
                      </div>
                      <button
                        className="ml-4 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                      // onClick={() => navigate({ to: "/cart" })}
                      >
                        View Cart
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 3D Clothing Customizer. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Help</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

function adjustColorBrightness(hex: string, brightness: number): string {
  hex = hex.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const factor = brightness / 100
  const adjust = (value: number) => Math.min(255, Math.max(0, Math.round(value * factor)))
  return `#${adjust(r).toString(16).padStart(2, "0")}${adjust(g).toString(16).padStart(2, "0")}${adjust(b).toString(16).padStart(2, "0")}`
}

export default RouteComponent