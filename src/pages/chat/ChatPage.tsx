"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  Camera,
  Upload,
  X,
  Sparkles,
  User,
  Bot,
  AlertCircle,
  ShoppingBag,
  Brush,
  Shirt,
  SwatchBookIcon as Swatch,
  Eye,
  MessageSquare,
  Lightbulb,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExtractedFeatures {
  skinTone: string
  skinToneRGB: [number, number, number]
  skinUndertone: string
  hairColor: string
  hairColorRGB: [number, number, number]
  eyeColor: string
  eyeColorRGB: [number, number, number]
  faceShape: string
  colorSeason: string
  suitableColors: string[]
  dominantColors: Array<{
    rgb: [number, number, number]
    hex: string
    name: string
    frequency: number
  }>
  gender: string
  ageGroup: string
  facialFeatures: {
    faceWidth: number
    faceHeight: number
    faceArea: number
    aspectRatio: number
  }
}

interface StyleRecommendations {
  professional: {
    clothing: string[]
    colors: string[]
    accessories: string[]
  }
  casual: {
    clothing: string[]
    colors: string[]
    accessories: string[]
  }
  evening: {
    clothing: string[]
    colors: string[]
    accessories: string[]
  }
  formal: {
    clothing: string[]
    colors: string[]
    accessories: string[]
  }
}

interface ColorCombinations {
  harmonious: string[]
  monochromatic: string[]
  complementary: string[]
  triadic: string[]
}

interface PersonalizedTips {
  makeup: string[]
  hairStyling: string[]
  eyewear: string[]
  jewelry: string[]
  patterns: string[]
}

interface SeasonalAdvice {
  spring: string[]
  summer: string[]
  autumn: string[]
  winter: string[]
}

interface ShoppingGuide {
  priorityItems: string[]
  budgetTips: string[]
  brands: string[]
  versatilePieces: string[]
}

interface SpecificRecommendations {
  faceShape: string
  bodyType: string
  lifestyle: string
}

interface SkinAnalysisResults {
  skinToneCategory: string
  undertoneAnalysis: string
  colorSeason: string
  bestColors: string[]
  avoidColors: string[]
}

interface Analysis {
  skinAnalysisResults: SkinAnalysisResults
  styleRecommendations: StyleRecommendations
  colorCombinations: ColorCombinations
  personalizedTips: PersonalizedTips
  seasonalAdvice: SeasonalAdvice
  shoppingGuide: ShoppingGuide
  specificRecommendations: SpecificRecommendations
  userRequestResponse?: string
}

interface APIResponse {
  success: boolean
  extractedFeatures: ExtractedFeatures
  analysis: Analysis
  userText: string
  timestamp: string
  error?: string
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  image?: string
  apiResponse?: APIResponse
  type: "text" | "analysis" | "recommendation" | "system" | "error"
}

export default function StyleScriptChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Welcome to StyleScript! I'm your AI style consultant powered by advanced computer vision and Gemini AI. Upload a photo of yourself to get started with personalized style recommendations, or ask me any fashion-related questions!",
      timestamp: new Date(),
      type: "system",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<APIResponse | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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

  const triggerFileInput = () => fileInputRef.current?.click()
  const triggerCameraInput = () => cameraInputRef.current?.click()
  const removeImage = () => setImagePreview(null)

  // Convert base64 image to blob for API
  const base64ToBlob = (base64: string): Blob => {
    const byteCharacters = atob(base64.split(",")[1])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: "image/jpeg" })
  }

  // Call the actual API
  const callAnalysisAPI = async (imageData?: string, text?: string): Promise<APIResponse> => {
    const formData = new FormData()

    if (text) {
      formData.append("text", text)
    }

    if (imageData) {
      const blob = base64ToBlob(imageData)
      formData.append("image", blob, "image.jpg")
    }

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API Error:", error)
      throw new Error(
        `Failed to connect to analysis service: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !imagePreview) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage || "Please analyze my photo and provide style recommendations.",
      timestamp: new Date(),
      image: imagePreview || undefined,
      type: imagePreview ? "analysis" : "text",
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setImagePreview(null)
    setIsAnalyzing(true)

    try {
      // Call the actual API
      const apiResponse = await callAnalysisAPI(userMessage.image, currentInput || undefined)

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Analysis failed")
      }

      setCurrentAnalysis(apiResponse)

      // Add API response message
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I've analyzed your request using our advanced AI system. Here are your personalized style recommendations:",
        timestamp: new Date(),
        apiResponse,
        type: "recommendation",
      }
      setMessages((prev) => [...prev, responseMessage])
    } catch (error) {
      console.error("Error processing request:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure the analysis service is running on localhost:5000 and try again.`,
        timestamp: new Date(),
        type: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const LoadingMessage = () => (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-md">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-slate-600">Analyzing with AI models...</span>
        </div>
      </div>
    </div>
  )

  const TabbedAnalysisCard = ({ response }: { response: APIResponse }) => {
    // Add safety checks for the response structure
    if (!response || !response.extractedFeatures) {
      return (
        <Card className="mt-3 border-red-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Invalid response data received</span>
            </div>
          </CardContent>
        </Card>
      )
    }

    const { extractedFeatures, analysis } = response

    return (
      <div className="mt-3 space-y-4">
        {/* Main Analysis Tabs */}
        <Card className="border-purple-200 shadow-lg overflow-hidden">
          <Tabs defaultValue="image-analysis" className="w-full">
            <div className="border-b border-slate-200 bg-slate-50">
              <TabsList className="h-auto p-0 bg-transparent w-full flex justify-start overflow-x-auto">
                <TabsTrigger
                  value="image-analysis"
                  className="data-[state=active]:bg-white rounded-none border-r border-slate-200 px-4 py-3 flex items-center gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  <span>Image Analysis</span>
                </TabsTrigger>
                {analysis?.skinAnalysisResults && (
                  <TabsTrigger
                    value="color-analysis"
                    className="data-[state=active]:bg-white rounded-none border-r border-slate-200 px-4 py-3 flex items-center gap-1.5"
                  >
                    <Swatch className="h-4 w-4" />
                    <span>Color Analysis</span>
                  </TabsTrigger>
                )}
                {analysis?.styleRecommendations && (
                  <TabsTrigger
                    value="style-guide"
                    className="data-[state=active]:bg-white rounded-none border-r border-slate-200 px-4 py-3 flex items-center gap-1.5"
                  >
                    <Shirt className="h-4 w-4" />
                    <span>Style Guide</span>
                  </TabsTrigger>
                )}
                {analysis?.personalizedTips && (
                  <TabsTrigger
                    value="beauty-tips"
                    className="data-[state=active]:bg-white rounded-none border-r border-slate-200 px-4 py-3 flex items-center gap-1.5"
                  >
                    <Brush className="h-4 w-4" />
                    <span>Beauty Tips</span>
                  </TabsTrigger>
                )}
                {analysis?.seasonalAdvice && (
                  <TabsTrigger
                    value="seasonal"
                    className="data-[state=active]:bg-white rounded-none border-r border-slate-200 px-4 py-3 flex items-center gap-1.5"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Seasonal</span>
                  </TabsTrigger>
                )}
                {analysis?.shoppingGuide && (
                  <TabsTrigger
                    value="shopping"
                    className="data-[state=active]:bg-white rounded-none px-4 py-3 flex items-center gap-1.5"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Shopping</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* Image Analysis Tab */}
            <TabsContent value="image-analysis" className="p-6 m-0">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900">Computer Vision Analysis</h3>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                  AI Extracted Features
                </Badge>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Physical Features */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Physical Features</h4>

                    {/* Skin Tone */}
                    {extractedFeatures.skinToneRGB && (
                      <div className="flex items-center space-x-4 mb-4 p-4 bg-slate-50 rounded-lg">
                        <div
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex-shrink-0"
                          style={{ backgroundColor: `rgb(${extractedFeatures.skinToneRGB.join(",")})` }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                              {extractedFeatures.skinTone || "Unknown"} skin
                            </Badge>
                            <Badge variant="outline" className="border-purple-200">
                              {extractedFeatures.skinUndertone || "Unknown"} undertone
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 font-mono">
                            RGB({extractedFeatures.skinToneRGB.join(",")})
                          </p>
                          <Badge variant="secondary" className="bg-green-50 text-green-700 mt-2">
                            {extractedFeatures.colorSeason || "Unknown"} Season
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Hair and Eyes */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {extractedFeatures.hairColorRGB && (
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Hair Color</h5>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: `rgb(${extractedFeatures.hairColorRGB.join(",")})` }}
                            />
                            <div>
                              <span className="text-sm capitalize font-medium">
                                {extractedFeatures.hairColor || "Unknown"}
                              </span>
                              <p className="text-xs text-slate-500 font-mono">
                                RGB({extractedFeatures.hairColorRGB.join(",")})
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {extractedFeatures.eyeColorRGB && (
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Eye Color</h5>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: `rgb(${extractedFeatures.eyeColorRGB.join(",")})` }}
                            />
                            <div>
                              <span className="text-sm capitalize font-medium">
                                {extractedFeatures.eyeColor || "Unknown"}
                              </span>
                              <p className="text-xs text-slate-500 font-mono">
                                RGB({extractedFeatures.eyeColorRGB.join(",")})
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Face Shape and Demographics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">Face Shape</h5>
                        <Badge variant="outline">{extractedFeatures.faceShape || "Unknown"}</Badge>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">Age Group</h5>
                        <Badge variant="outline" className="capitalize">
                          {extractedFeatures.ageGroup || "Unknown"}
                        </Badge>
                      </div>
                    </div>

                    {/* Facial Measurements */}
                    {extractedFeatures.facialFeatures && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Facial Measurements</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Width:</span>
                            <span>{extractedFeatures.facialFeatures.faceWidth || 0}px</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Height:</span>
                            <span>{extractedFeatures.facialFeatures.faceHeight || 0}px</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Area:</span>
                            <span>{extractedFeatures.facialFeatures.faceArea?.toLocaleString() || 0}px²</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Ratio:</span>
                            <span>{extractedFeatures.facialFeatures.aspectRatio || 0}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-6">
                  {/* Suitable Colors */}
                  {extractedFeatures.suitableColors && extractedFeatures.suitableColors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Recommended Color Palette</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {extractedFeatures.suitableColors.map((color, index) => (
                          <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dominant Colors from Image */}
                  {extractedFeatures.dominantColors && extractedFeatures.dominantColors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Dominant Colors in Image</h4>
                      <div className="space-y-3">
                        {extractedFeatures.dominantColors.slice(0, 5).map((color, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm capitalize">{color.name}</span>
                                <span className="text-xs text-slate-500">{(color.frequency * 100).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between items-center text-xs text-slate-500">
                                <span className="font-mono">{color.hex}</span>
                                <span className="font-mono">RGB({color.rgb.join(",")})</span>
                              </div>
                              <Progress value={color.frequency * 100} className="h-1.5 mt-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skin Analysis Summary */}
                  {analysis?.skinAnalysisResults && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-sm mb-2 text-blue-900">AI Skin Analysis Summary</h4>
                      {analysis.skinAnalysisResults.skinToneCategory && (
                        <p className="text-sm text-blue-800 mb-2">{analysis.skinAnalysisResults.skinToneCategory}</p>
                      )}
                      {analysis.skinAnalysisResults.undertoneAnalysis && (
                        <p className="text-sm text-blue-800">{analysis.skinAnalysisResults.undertoneAnalysis}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Color Analysis Tab */}
            {analysis?.skinAnalysisResults && (
              <TabsContent value="color-analysis" className="p-6 m-0">
                <div className="flex items-center gap-2 mb-6">
                  <Swatch className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Color Theory & Analysis</h3>
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                    Personalized Palette
                  </Badge>
                </div>

                <div className="space-y-8">
                  {/* Color Season Analysis */}
                  {analysis.skinAnalysisResults.colorSeason && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Your Color Season</h4>
                      <p className="text-sm text-slate-700">{analysis.skinAnalysisResults.colorSeason}</p>
                    </div>
                  )}

                  {/* Best and Avoid Colors */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.skinAnalysisResults.bestColors && (
                      <Card className="border-green-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-green-800">✓ Best Colors for You</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.skinAnalysisResults.bestColors.map((color, index) => (
                              <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {analysis.skinAnalysisResults.avoidColors && (
                      <Card className="border-red-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-red-800">✗ Colors to Avoid</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.skinAnalysisResults.avoidColors.map((color, index) => (
                              <Badge key={index} variant="secondary" className="bg-red-50 text-red-700">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Color Combinations */}
                  {analysis.colorCombinations && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4">Color Combination Ideas</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {analysis.colorCombinations.harmonious && (
                          <Card className="border-blue-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-blue-800">Harmonious Combinations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysis.colorCombinations.harmonious.map((combo, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>{combo}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                        {analysis.colorCombinations.complementary && (
                          <Card className="border-orange-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-orange-800">Complementary Combinations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysis.colorCombinations.complementary.map((combo, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>{combo}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                        {analysis.colorCombinations.monochromatic && (
                          <Card className="border-purple-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-purple-800">Monochromatic Combinations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysis.colorCombinations.monochromatic.map((combo, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>{combo}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                        {analysis.colorCombinations.triadic && (
                          <Card className="border-green-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-green-800">Triadic Combinations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysis.colorCombinations.triadic.map((combo, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>{combo}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Style Guide Tab */}
            {analysis?.styleRecommendations && (
              <TabsContent value="style-guide" className="p-6 m-0">
                <div className="flex items-center gap-2 mb-6">
                  <Shirt className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Style Recommendations</h3>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    Occasion-Based Styling
                  </Badge>
                </div>

                <div className="space-y-6">
                  {Object.entries(analysis.styleRecommendations).map(([occasion, details]) => (
                    <Card key={occasion} className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="outline" className="border-green-200 text-green-700 capitalize">
                            {occasion}
                          </Badge>
                          <span className="text-base capitalize">{occasion} Style Guide</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h5 className="font-medium text-sm mb-3 text-slate-900">Clothing Pieces</h5>
                            <ul className="space-y-2">
                              {(details.clothing || []).map((item, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-3 text-slate-900">Color Palette</h5>
                            <div className="flex flex-wrap gap-1">
                              {(details.colors || []).map((color, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {color}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-3 text-slate-900">Accessories</h5>
                            <ul className="space-y-2">
                              {(details.accessories || []).map((item, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Specific Recommendations */}
                  {analysis.specificRecommendations && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4">Personalized Recommendations</h4>
                      <div className="grid gap-4">
                        {analysis.specificRecommendations.faceShape && (
                          <Card className="border-blue-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-blue-800">Face Shape Styling</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-slate-700">{analysis.specificRecommendations.faceShape}</p>
                            </CardContent>
                          </Card>
                        )}
                        {analysis.specificRecommendations.bodyType && (
                          <Card className="border-purple-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-purple-800">Body Type Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-slate-700">{analysis.specificRecommendations.bodyType}</p>
                            </CardContent>
                          </Card>
                        )}
                        {analysis.specificRecommendations.lifestyle && (
                          <Card className="border-green-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm text-green-800">Lifestyle Considerations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-slate-700">{analysis.specificRecommendations.lifestyle}</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Beauty Tips Tab */}
            {analysis?.personalizedTips && (
              <TabsContent value="beauty-tips" className="p-6 m-0">
                <div className="flex items-center gap-2 mb-6">
                  <Brush className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Beauty & Styling Tips</h3>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    Expert Advice
                  </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {analysis.personalizedTips.makeup && (
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-purple-800 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          Makeup
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.personalizedTips.makeup.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {analysis.personalizedTips.hairStyling && (
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-blue-800 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Hair Styling
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.personalizedTips.hairStyling.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {analysis.personalizedTips.eyewear && (
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-green-800 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          Eyewear
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.personalizedTips.eyewear.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {analysis.personalizedTips.jewelry && (
                    <Card className="border-yellow-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-yellow-800 flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                          Jewelry
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.personalizedTips.jewelry.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {analysis.personalizedTips.patterns && (
                    <Card className="border-orange-200 md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-orange-800 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                          Patterns & Prints
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.personalizedTips.patterns.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Seasonal Tab */}
            {analysis?.seasonalAdvice && (
              <TabsContent value="seasonal" className="p-6 m-0">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Seasonal Style Guide</h3>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    Year-Round Styling
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {analysis.seasonalAdvice.spring && (
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-green-800">🌸 Spring</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.seasonalAdvice.spring.map((advice, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{advice}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {analysis.seasonalAdvice.summer && (
                    <Card className="border-yellow-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-yellow-800">☀️ Summer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.seasonalAdvice.summer.map((advice, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{advice}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {analysis.seasonalAdvice.autumn && (
                    <Card className="border-orange-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-orange-800">🍂 Autumn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.seasonalAdvice.autumn.map((advice, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{advice}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {analysis.seasonalAdvice.winter && (
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-blue-800">❄️ Winter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.seasonalAdvice.winter.map((advice, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{advice}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Shopping Tab */}
            {analysis?.shoppingGuide && (
              <TabsContent value="shopping" className="p-6 m-0">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Shopping Guide</h3>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    Smart Shopping
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.shoppingGuide.priorityItems && (
                      <Card className="border-green-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-green-800">🎯 Priority Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.shoppingGuide.priorityItems.map((item, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.shoppingGuide.versatilePieces && (
                      <Card className="border-blue-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-blue-800">🔄 Versatile Pieces</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.shoppingGuide.versatilePieces.map((item, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {analysis.shoppingGuide.budgetTips && (
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-purple-800">💰 Budget Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.shoppingGuide.budgetTips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {analysis.shoppingGuide.brands && (
                    <Card className="border-orange-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-orange-800">🏪 Recommended Brands</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.shoppingGuide.brands.map((brand, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{brand}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </Card>

        {/* User Input & AI Response Section */}
        {(response.userText || analysis?.userRequestResponse) && (
          <Card className="border-indigo-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <MessageSquare className="h-5 w-5" />
                Your Question & AI Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {response.userText && (
                <div>
                  <h4 className="font-medium text-sm mb-2 text-slate-900">Your Question:</h4>
                  <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-400">
                    <p className="text-sm text-slate-700 italic">"{response.userText}"</p>
                  </div>
                </div>
              )}

              {analysis?.userRequestResponse && (
                <div>
                  <h4 className="font-medium text-sm mb-2 text-slate-900 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-indigo-600" />
                    AI Personalized Response:
                  </h4>
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {analysis.userRequestResponse}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">StyleScript AI</h1>
              <p className="text-sm text-slate-600">Powered by Computer Vision & Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-50 text-purple-700">
              Real-time Analysis
            </Badge>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback
                  className={
                    message.role === "user"
                      ? "bg-slate-900 text-white"
                      : message.role === "system"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                        : message.type === "error"
                          ? "bg-red-600 text-white"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  }
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : message.role === "system" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : message.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col space-y-2 max-w-[90%] ${message.role === "user" ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${message.role === "user"
                      ? "bg-slate-900 text-white"
                      : message.role === "system"
                        ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-900"
                        : message.type === "error"
                          ? "bg-red-50 border border-red-200 text-red-900"
                          : "bg-white border border-slate-200 shadow-sm"
                    }`}
                >
                  {message.image && (
                    <div className="mb-3">
                      <img
                        src={message.image || "/placeholder.svg"}
                        alt="Uploaded"
                        className="rounded-lg max-h-64 max-w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>

                {/* API Response with Restructured Tabs */}
                {message.apiResponse && <TabbedAnalysisCard response={message.apiResponse} />}

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {message.type === "analysis" && (
                    <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      Computer Vision
                    </Badge>
                  )}
                  {message.type === "recommendation" && (
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                      AI Analysis
                    </Badge>
                  )}
                  {message.type === "error" && (
                    <Badge variant="secondary" className="text-xs bg-red-50 text-red-700">
                      Error
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isAnalyzing && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
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
                currentAnalysis
                  ? "Ask follow-up questions about your style, request specific outfit ideas, or upload a new photo..."
                  : "Upload a photo for comprehensive style analysis, or ask me any fashion-related questions..."
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

          {/* Context Indicator */}
          {currentAnalysis && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-slate-500">
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: `rgb(${currentAnalysis.extractedFeatures.skinToneRGB.join(",")})` }}
              />
              <span>
                Current analysis: {currentAnalysis.extractedFeatures.skinTone} skin with{" "}
                {currentAnalysis.extractedFeatures.skinUndertone} undertones
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
