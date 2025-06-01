"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Outfit {
  occasion: string
  items: string[]
  colors: string[]
}

interface RecommendationCardProps {
  outfit: Outfit
}

export function RecommendationCard({ outfit }: RecommendationCardProps) {
  const getOccasionIcon = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case "professional":
        return "💼"
      case "casual":
        return "👕"
      case "evening":
        return "✨"
      default:
        return "👗"
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{getOccasionIcon(outfit.occasion)}</span>
          {outfit.occasion}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Outfit Items</h4>
          <ul className="space-y-2">
            {outfit.items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Color Palette</h4>
          <div className="flex gap-2">
            {outfit.colors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
