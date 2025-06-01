"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Loader2, Download, Share2, ShoppingCart, ArrowLeft, Heart, Palette, Undo2 } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ModelLoader, ModelErrorBoundary } from "@/components/ModelLoader"

// Clothing data (same as catalog)
const clothes = [
  {
    id: "oxford-shirt",
    name: "Classic Oxford Shirt",
    model: "/src/assets/models/shirt.glb",
    price: 89.99,
    rating: 4.5,
    tags: ["casual", "formal", "tops"],
    isNew: true,
    colors: ["#ffffff", "#4a90e2", "#2c3e50"],
    colorNames: ["White", "Blue", "Navy"],
    description: "Premium cotton oxford shirt with classic fit",
  },
  {
    id: "silk-kurta",
    name: "Traditional Silk Kurta",
    model: "/src/assets/models/shirt2.glb",
    price: 129.99,
    rating: 4.8,
    tags: ["ethnic", "formal", "tops"],
    isNew: false,
    colors: ["#f5f5dc", "#8b0000", "#228b22"],
    colorNames: ["Cream", "Maroon", "Green"],
    description: "Handwoven silk kurta with intricate embroidery",
  },
  {
    id: "chino-pants",
    name: "Slim Fit Chino Pants",
    model: "/assets/3d/duck.glb",
    price: 69.99,
    rating: 4.2,
    tags: ["casual", "formal", "bottoms"],
    isNew: false,
    colors: ["#2c3e50", "#1e3a8a", "#8b4513"],
    colorNames: ["Black", "Navy", "Khaki"],
    description: "Comfortable slim-fit chinos for everyday wear",
  },
  {
    id: "denim-jacket",
    name: "Premium Denim Jacket",
    model: "/assets/3d/duck.glb",
    price: 149.99,
    rating: 4.7,
    tags: ["casual", "outerwear"],
    isNew: true,
    colors: ["#4169e1", "#2c3e50", "#708090"],
    colorNames: ["Blue", "Black", "Washed"],
    description: "Classic denim jacket with modern fit",
  },
  {
    id: "wool-sweater",
    name: "Merino Wool Sweater",
    model: "/assets/3d/duck.glb",
    price: 119.99,
    rating: 4.4,
    tags: ["casual", "winter", "tops"],
    isNew: false,
    colors: ["#808080", "#1e3a8a", "#800020"],
    colorNames: ["Gray", "Navy", "Burgundy"],
    description: "Soft merino wool sweater for cold weather",
  },
  {
    id: "graphic-tee",
    name: "Premium Graphic T-Shirt",
    model: "/src/assets/models/t-shirt.glb",
    price: 49.99,
    rating: 4.3,
    tags: ["casual", "tops"],
    isNew: true,
    colors: ["#ffffff", "#2c3e50", "#808080"],
    colorNames: ["White", "Black", "Gray"],
    description: "High-quality cotton tee with unique graphics",
  },
]

// 3D Model Component
function ClothingModel({ modelPath, color, scale = 1.2 }: { modelPath: string; color: string; scale?: number }) {
  return (
    <group scale={[scale, scale, scale]}>
      <mesh>
        <boxGeometry args={[1, 1.5, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

// 3D Viewer Component
function ClothViewer({ modelPath, color }: { modelPath: string; color: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Suspense
        fallback={
          <Html center>
            <div className="text-white bg-black/50 px-4 py-2 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <div>Loading 3D model...</div>
            </div>
          </Html>
        }
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <spotLight position={[-10, 10, 5]} intensity={0.5} />
        <ModelErrorBoundary>
          <ModelLoader modelPath={modelPath} color={color} scale={3.2} />
        </ModelErrorBoundary>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxDistance={8}
          minDistance={3}
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  )
}

// Utility function to adjust color brightness
function adjustColorBrightness(hex: string, brightness: number): string {
  hex = hex.replace("#", "")
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  const factor = brightness / 100
  const adjust = (value: number) => Math.min(255, Math.max(0, Math.round(value * factor)))
  return `#${adjust(r).toString(16).padStart(2, "0")}${adjust(g).toString(16).padStart(2, "0")}${adjust(b).toString(16).padStart(2, "0")}`
}

export default function CustomizePage() {
  const { itemId } = useParams<{ itemId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  // Get item data from navigation state or find by ID
  const item = location.state?.item || clothes.find((c) => c.id === itemId)

  const [selectedColor, setSelectedColor] = useState(item?.colors[0] || "#3B82F6")
  const [brightness, setBrightness] = useState(100)
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("customize")
  const [recentColors, setRecentColors] = useState(["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"])

  const adjustedColor = adjustColorBrightness(selectedColor, brightness)
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

  // Redirect if item not found
  useEffect(() => {
    if (!item) {
      navigate("/catalog")
    }
  }, [item, navigate])

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/catalog")}>Back to Catalog</Button>
        </div>
      </div>
    )
  }

  const handleColorSelect = (newColor: string) => {
    setSelectedColor(newColor)
    if (!recentColors.includes(newColor)) {
      setRecentColors((prev) => [newColor, ...prev.slice(0, 4)])
    }
  }

  const handleAddToCart = () => {
    setIsLoading(true)
    setTimeout(() => {
      setAddedToCart(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleGenerateDesign = () => {
    setIsLoading(true)
    setActiveTab("preview")
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleBackToCatalog = () => {
    navigate("/catalog")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleBackToCatalog} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalog
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StyleScript Customizer
              </h1>
              <p className="text-gray-600">Customize your {item.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div className="relative">
            <Card className="overflow-hidden h-[700px]">
              <CardContent className="p-0 h-full bg-gradient-to-br from-gray-50 to-gray-100">
                <ClothViewer modelPath={item.model} color={adjustedColor} />

                {/* Loading Overlay */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10"
                    >
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-lg font-medium">
                          {addedToCart ? "Adding to cart..." : "Generating your design..."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                {activeTab === "preview" && !isLoading && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      Save
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            {/* Product Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">${item.price}</div>
                    {item.isNew && <Badge className="mt-2 bg-emerald-500">New Arrival</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customization Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customize">Customize</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="customize" className="space-y-6 mt-6">
                    {/* Color Selection */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Choose Color</h3>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {item.colors.map((color, index) => (
                          <button
                            key={color}
                            className={`p-3 rounded-lg border-2 transition-all ${selectedColor === color
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() => handleColorSelect(color)}
                          >
                            <div
                              className="w-8 h-8 rounded-full mx-auto mb-2 border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium">{item.colorNames[index]}</span>
                          </button>
                        ))}
                      </div>

                      {/* Recent Colors */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Recent Colors</h4>
                        <div className="flex gap-2">
                          {recentColors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? "border-gray-900 scale-110" : "border-gray-200"
                                }`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorSelect(color)}
                            />
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-gray-200 overflow-hidden">
                            <input
                              type="color"
                              value={selectedColor}
                              onChange={(e) => handleColorSelect(e.target.value)}
                              className="w-10 h-10 transform translate-x-[-4px] translate-y-[-4px] cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Brightness Control */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Brightness</span>
                          <span className="text-sm text-gray-600">{brightness}%</span>
                        </div>
                        <Slider
                          value={[brightness]}
                          onValueChange={(value) => setBrightness(value[0])}
                          min={50}
                          max={150}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateDesign}
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Palette className="w-4 h-4 mr-2" />
                          Generate Design
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Your Custom Design</h3>
                      <p className="text-gray-600 mb-4">
                        Here's your customized {item.name}. You can order it now or make further adjustments.
                      </p>

                      <div className="p-4 bg-gray-50 rounded-lg mb-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Design Details</h4>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
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
                          <Badge variant="outline">3D Model</Badge>
                        </div>
                      </div>

                      {/* Size Selection */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-3">Select Size</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {availableSizes.map((size) => (
                            <Button
                              key={size}
                              variant={selectedSize === size ? "default" : "outline"}
                              onClick={() => setSelectedSize(size)}
                              className="h-12"
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-3">Quantity</h4>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                            -
                          </Button>
                          <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="flex justify-between items-center font-medium mb-6">
                        <span className="text-lg">Total Price:</span>
                        <span className="text-2xl font-bold text-blue-600">${(item.price * quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setActiveTab("customize")}>
                        <Undo2 className="w-4 h-4 mr-2" />
                        Edit Design
                      </Button>

                      <Button
                        onClick={handleAddToCart}
                        disabled={isLoading || addedToCart}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {addedToCart ? (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>

                    {addedToCart && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                      >
                        <p className="font-medium">Item added to your cart!</p>
                        <p className="text-sm">Your custom design has been saved.</p>
                        <Button
                          size="sm"
                          className="mt-2 bg-green-600 hover:bg-green-700"
                          onClick={() => navigate("/cart")}
                        >
                          View Cart
                        </Button>
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
