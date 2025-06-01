"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette } from "lucide-react"

interface SkinTone {
  category: string
  undertone: string
  hex: string
  description: string
}

interface StyleAnalysisProps {
  skinTone: SkinTone
  uploadedImage: string | null
}

export function StyleAnalysis({ skinTone, uploadedImage }: StyleAnalysisProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Skin Tone Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {uploadedImage && (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200">
              <img src={uploadedImage || "/placeholder.svg"} alt="Your photo" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: skinTone.hex }}
              />
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {skinTone.category}
              </Badge>
              <Badge variant="outline" className="border-purple-200">
                {skinTone.undertone} Undertone
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{skinTone.description}</p>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Your Skin Tone Code</h4>
          <div className="flex items-center gap-2">
            <code className="bg-white px-2 py-1 rounded text-sm font-mono">{skinTone.hex}</code>
            <span className="text-sm text-purple-700">
              {skinTone.category} • {skinTone.undertone}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
