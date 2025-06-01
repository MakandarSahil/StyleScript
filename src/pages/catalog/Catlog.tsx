"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Filter, Heart, Star, X, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModelLoader, ModelErrorBoundary } from "@/components/ModelLoader"

// Updated clothing data with your actual models
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
  {
    id: "chino-pants",
    name: "Slim Fit Chino Pants",
    model: "/src/assets/models/shirt.glb", // Reusing shirt model for pants
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
    model: "/src/assets/models/shirt2.glb", // Reusing shirt2 model for jacket
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
    model: "/src/assets/models/t-shirt.glb", // Reusing t-shirt model for sweater
    price: 119.99,
    rating: 4.4,
    tags: ["casual", "winter", "tops"],
    isNew: false,
    colors: ["#808080", "#1e3a8a", "#800020"],
    colorNames: ["Gray", "Navy", "Burgundy"],
    description: "Soft merino wool sweater for cold weather",
  },
]

// Loading component for 3D models
function ModelLoadingFallback() {
  return (
    <Html center>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <div className="text-sm text-gray-600">Loading 3D model...</div>
      </div>
    </Html>
  )
}

// All available tags
const allTags = Array.from(new Set(clothes.flatMap((item) => item.tags)))

export default function Catalog() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("featured")
  const [favorites, setFavorites] = useState<string[]>([])
  const [filteredClothes, setFilteredClothes] = useState(clothes)

  // Apply filters and sorting
  useEffect(() => {
    let result = [...clothes]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) => item.name.toLowerCase().includes(query) || item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter((item) => selectedTags.some((tag) => item.tags.includes(tag)))
    }

    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }

    setFilteredClothes(result)
  }, [searchQuery, selectedTags, sortOption])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSortOption("featured")
  }

  const openCustomizer = (item: any) => {
    // Navigate to customization page with item data
    navigate(`/customize/${item.id}`, {
      state: { item },
    })
  }

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-amber-400" />
            <Star
              className="absolute top-0 left-0 w-4 h-4 fill-amber-400 text-amber-400 overflow-hidden"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-amber-400" />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StyleScript
              </h1>
              <p className="text-gray-600 mt-1">3D Fashion Customization Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {filteredClothes.length} Items
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search for clothing by name or category..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-12">
                  <Filter size={16} />
                  Filters
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>Narrow down your clothing selection</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedTags.length > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button className="ml-1 rounded-full hover:bg-gray-200 p-0.5" onClick={() => setSearchQuery("")}>
                  <X size={14} />
                </button>
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize flex items-center gap-1">
                {tag}
                <button className="ml-1 rounded-full hover:bg-gray-200 p-0.5" onClick={() => toggleTag(tag)}>
                  <X size={14} />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Clothing Grid */}
        {filteredClothes.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredClothes.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-blue-200 cursor-pointer h-full flex flex-col bg-white"
                    onClick={() => openCustomizer(item)}
                  >
                    <div className="relative flex-1">
                      <div className="h-72 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                          <Suspense fallback={null}>
                            <Environment preset="studio" />
                            <ambientLight intensity={0.7} />
                            <directionalLight position={[5, 5, 5]} intensity={1.2} />
                            <ModelErrorBoundary>
                              <ModelLoader
                                modelPath={item.model}
                                color={item.colors[0]}
                                scale={1.8}
                                autoRotate={true}
                              />
                            </ModelErrorBoundary>
                            <OrbitControls
                              enablePan={false}
                              enableZoom={false}
                              autoRotate
                              autoRotateSpeed={1}
                              enableDamping={true}
                              dampingFactor={0.05}
                            />
                          </Suspense>
                        </Canvas>
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                              onClick={(e) => toggleFavorite(item.id, e)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart
                                size={18}
                                className={
                                  favorites.includes(item.id) ? "fill-rose-500 text-rose-500" : "text-gray-400"
                                }
                              />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {item.isNew && (
                        <Badge className="absolute top-2 left-2 bg-emerald-500 hover:bg-emerald-600">New</Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                        <span className="font-bold text-lg">${item.price}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                      <div className="mb-3">{renderRating(item.rating)}</div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500">Colors:</span>
                        {item.colors.map((color, index) => (
                          <div
                            key={color}
                            className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={item.colorNames[index]}
                          />
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs capitalize">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Palette className="w-4 h-4 mr-2" />
                        Customize in 3D
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16 border rounded-lg bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No items found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
