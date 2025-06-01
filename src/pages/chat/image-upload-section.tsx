"use client"

import type React from "react"

import { useRef } from "react"
import { Camera, Upload, X, Sparkles, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ImageUploadSectionProps {
  onImageUpload: (imageUrl: string) => void
  userInput: string
  onInputChange: (text: string) => void
  isAnalyzing: boolean
  onAnalyze: () => void
  hasImage: boolean
  uploadedImage: string | null
}

export function ImageUploadSection({
  onImageUpload,
  userInput,
  onInputChange,
  isAnalyzing,
  onAnalyze,
  hasImage,
  uploadedImage,
}: ImageUploadSectionProps) {
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
        onImageUpload(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    onImageUpload("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const triggerFileInput = () => fileInputRef.current?.click()
  const triggerCameraInput = () => cameraInputRef.current?.click()

  return (
    <div className="space-y-8">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {!uploadedImage ? (
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-50 rounded-3xl flex items-center justify-center border border-slate-200">
              <ImageIcon className="w-12 h-12 text-slate-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-900">Upload Your Photo</h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                Take a clear, well-lit photo or upload from your gallery for the most accurate analysis
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={triggerCameraInput}
              className="bg-slate-900 hover:bg-slate-800 text-white gap-3 h-12 px-6"
              size="lg"
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </Button>
            <Button
              onClick={triggerFileInput}
              variant="outline"
              className="border-slate-300 hover:bg-slate-50 gap-3 h-12 px-6"
              size="lg"
            >
              <Upload className="w-5 h-5" />
              Upload Image
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>10MB Max</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-0 relative">
              <div className="aspect-video relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <Button
                  onClick={removeImage}
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Badge className="absolute bottom-4 left-4 bg-white/90 text-slate-900 hover:bg-white">
                  Ready for Analysis
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Additional Context <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <Textarea
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Share your style goals, preferred occasions, or any specific questions about your look..."
                className="min-h-[120px] border-slate-200 focus:border-slate-400 resize-none"
              />
            </div>

            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white gap-3 h-14 text-lg font-semibold"
              size="lg"
            >
              <Sparkles className="w-5 h-5" />
              {isAnalyzing ? "Analyzing Your Style..." : "Start Professional Analysis"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
