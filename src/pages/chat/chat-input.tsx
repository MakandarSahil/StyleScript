"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Send, Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string, image?: string) => void
  isAnalyzing: boolean
  hasCurrentAnalysis: boolean
}

export function ChatInput({ onSendMessage, isAnalyzing, hasCurrentAnalysis }: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState("")
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
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() && !imagePreview) return

    onSendMessage(
      inputMessage || "Please analyze my photo and provide style recommendations.",
      imagePreview || undefined,
    )

    setInputMessage("")
    setImagePreview(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const triggerFileInput = () => fileInputRef.current?.click()
  const triggerCameraInput = () => cameraInputRef.current?.click()
  const removeImage = () => setImagePreview(null)

  return (
    <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-4">
      <div className="max-w-5xl mx-auto">
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {/* API Status Alert */}
        <Alert className="mb-3 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Make sure your analysis service is running on{" "}
            <code className="bg-blue-100 px-1 rounded">localhost:5000</code> for real-time analysis.
          </AlertDescription>
        </Alert>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="h-16 w-16 rounded-lg overflow-hidden border border-purple-300">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-purple-900">Image ready for analysis</p>
              <p className="text-xs text-purple-700">
                Will be sent to localhost:5000/analyze for computer vision processing and AI recommendations
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={removeImage} className="h-8 w-8 text-purple-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Input Field */}
        <div className="relative">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hasCurrentAnalysis
                ? "Ask follow-up questions about your style, request specific outfit ideas, or upload a new photo for fresh analysis..."
                : "Upload a photo for comprehensive style analysis, or ask me any fashion-related questions (text-only responses available)..."
            }
            className="min-h-[60px] pr-24 resize-none border-slate-200 focus:border-purple-400 focus:ring-purple-400"
            disabled={isAnalyzing}
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={triggerCameraInput}
              className="h-8 w-8 text-slate-500 hover:text-purple-600"
              disabled={isAnalyzing}
              title="Take photo"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={triggerFileInput}
              className="h-8 w-8 text-slate-500 hover:text-purple-600"
              disabled={isAnalyzing}
              title="Upload image"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !imagePreview) || isAnalyzing}
              className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="icon"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
