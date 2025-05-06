"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Search, Filter, Heart, Star, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Updated clothing data with actual model paths
const clothes = [
  {
    id: "shirt",
    name: "Classic Oxford Shirt",
    model: "/models/shirt_full.glb",
    price: 49.99,
    rating: 4.5,
    tags: ["casual", "formal", "tops"],
    isNew: true,
    colors: ["white", "blue", "black"],
  },
  {
    id: "kurta",
    name: "Traditional Silk Kurta",
    model: "/models/kurta.glb",
    price: 59.99,
    rating: 4.8,
    tags: ["ethnic", "formal", "tops"],
    isNew: false,
    colors: ["cream", "maroon", "green"],
  },
  {
    id: "pant",
    name: "Slim Fit Chino Pants",
    model: "/models/slim_pant.glb",
    price: 39.99,
    rating: 4.2,
    tags: ["casual", "formal", "bottoms"],
    isNew: false,
    colors: ["black", "navy", "khaki"],
  },
  {
    id: "jacket",
    name: "Premium Denim Jacket",
    model: "/models/denim_jacket.glb",
    price: 79.99,
    rating: 4.7,
    tags: ["casual", "outerwear"],
    isNew: true,
    colors: ["blue", "black", "washed"],
  },
  {
    id: "sweater",
    name: "Merino Wool Sweater",
    model: "/models/male_sweater.glb",
    price: 69.99,
    rating: 4.4,
    tags: ["casual", "winter", "tops"],
    isNew: false,
    colors: ["gray", "navy", "burgundy"],
  },
  {
    id: "tshirt",
    name: "Premium Graphic T-Shirt",
    model: "/models/t_shirt.glb",
    price: 29.99,
    rating: 4.3,
    tags: ["casual", "tops"],
    isNew: true,
    colors: ["white", "black", "gray"],
  },
]

// All available tags from the clothing items
const allTags = Array.from(new Set(clothes.flatMap((item) => item.tags)))

export default function CatalogPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("featured")
  const [favorites, setFavorites] = useState<string[]>([])
  const [filteredClothes, setFilteredClothes] = useState(clothes)



  // Apply filters and sorting
  useEffect(() => {
    let result = [...clothes]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) => item.name.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter((item) => selectedTags.some((tag) => item.tags.includes(tag)))
    }

    // Apply sorting
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
      // 'featured' is default, no sorting needed
    }

    setFilteredClothes(result)
  }, [searchQuery, selectedTags, sortOption])

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Toggle favorite status
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSortOption("featured")
  }

  // Render star ratings
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

  // Navigate directly to customization page
  const navigateToCustomize = (itemId: string) => {
    // Find the item's model path from the clothes array
    const selectedItem = clothes.find(item => item.id === itemId);
    const modelPath = selectedItem ? selectedItem.model : "/models/shirt_full.glb";

    navigate({
      to: '/catalog/$clothId',
      params: { clothId: itemId },
      search: { model: modelPath }
    });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Premium Clothing Collection</h1>
        <p className="text-gray-500">Discover and customize your perfect style</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search for clothing by name or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
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
            <SelectTrigger className="w-[180px]">
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

      {/* Selected Filters Display */}
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <button
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                onClick={() => setSearchQuery("")}
              >
                <X size={14} />
              </button>
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize flex items-center gap-1">
              {tag}
              <button
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                onClick={() => toggleTag(tag)}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-500">
        Showing {filteredClothes.length} of {clothes.length} items
      </div>

      {/* Clothing Grid */}
      {filteredClothes.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
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
                  className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer h-full flex flex-col"
                  onClick={() => navigateToCustomize(item.id)}
                >
                  <div className="relative flex-1">
                    <div className="h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                      <motion.div
                        className="text-center p-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-5xl mb-2">👕</div>
                        <span className="text-sm text-gray-500">{item.name}</span>
                      </motion.div>
                    </div>

                    {/* Favorite button */}
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
                              className={favorites.includes(item.id) ? "fill-rose-500 text-rose-500" : "text-gray-400"}
                            />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* New badge */}
                    {item.isNew && (
                      <Badge className="absolute top-2 left-2 bg-emerald-500 hover:bg-emerald-600">
                        New Arrival
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">{renderRating(item.rating)}</div>

                    {/* Color options */}
                    <div className="flex items-center gap-1 mb-3">
                      {item.colors.map((color) => (
                        <div
                          key={color}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color === "washed" ? "#d4d1d1" : color }}
                          title={color}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{item.colors.length} colors</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs capitalize">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      Customize Now
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12 border rounded-lg bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </motion.div>
      )}
    </div>
  )
}