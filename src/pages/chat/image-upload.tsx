"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Camera, Upload, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  userText: string
  onTextChange: (text: string) => void
  isAnalyzing: boolean
  onAnalyze: () => void
  hasImage: boolean
}

export function ImageUpload({
  onImageUpload,
  userText,
  onTextChange,
  isAnalyzing,
  onAnalyze,
  hasImage,
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        onImageUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    onImageUpload("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const triggerCameraInput = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {!imagePreview ? (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Photo</h3>
              <p className="text-gray-600">Take a selfie or upload a clear photo of yourself for the best analysis</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={triggerCameraInput}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              size="lg"
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </Button>
            <Button
              onClick={triggerFileInput}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 gap-2"
              size="lg"
            >
              <Upload className="w-5 h-5" />
              Upload from Gallery
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Uploaded photo"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <Button onClick={removeImage} variant="destructive" size="icon" className="absolute top-2 right-2">
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Information (Optional)</label>
              <Textarea
                value={userText}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="Tell us about your style preferences, occasions you dress for, or any specific questions..."
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              size="lg"
            >
              <Sparkles className="w-5 h-5" />
              {isAnalyzing ? "Analyzing..." : "Analyze My Style"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
