import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Camera, Upload, X, Sparkles, Palette, User, Bot, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

      console.log("response:", response)

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

  const ExtractedFeaturesCard = ({ features }: { features: ExtractedFeatures }) => (
    <Card className="mt-3 border-purple-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Extracted Features</h3>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700">
            Computer Vision
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: `rgb(${features.skinToneRGB.join(",")})` }}
              />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    {features.skinTone} skin
                  </Badge>
                  <Badge variant="outline" className="border-purple-200">
                    {features.skinUndertone} undertone
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 font-mono">RGB({features.skinToneRGB.join(",")})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Hair Color</h4>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: `rgb(${features.hairColorRGB.join(",")})` }}
                  />
                  <span className="text-sm capitalize">{features.hairColor}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Eye Color</h4>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: `rgb(${features.eyeColorRGB.join(",")})` }}
                  />
                  <span className="text-sm capitalize">{features.eyeColor}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Face Shape</h4>
                <Badge variant="outline">{features.faceShape}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Color Season</h4>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  {features.colorSeason}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Suitable Colors</h4>
            <div className="flex flex-wrap gap-2">
              {features.suitableColors.map((color, index) => (
                <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                  {color}
                </Badge>
              ))}
            </div>

            <h4 className="font-semibold text-slate-900">Dominant Colors</h4>
            <div className="space-y-2">
              {features.dominantColors.slice(0, 5).map((color, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm capitalize">{color.name}</span>
                      <span className="text-xs text-slate-500">{(color.frequency * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={color.frequency * 100} className="h-1 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const AnalysisResponseCard = ({ response }: { response: APIResponse }) => (
    <Card className="mt-3 border-green-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-slate-900">AI Style Analysis</h3>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            Powered by Gemini AI
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Skin Analysis Results */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Skin Tone Analysis</h4>
            <div className="grid gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Skin Tone Category</h5>
                <p className="text-sm text-slate-700">{response.analysis.skinAnalysisResults.skinToneCategory}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Undertone Analysis</h5>
                <p className="text-sm text-slate-700">{response.analysis.skinAnalysisResults.undertoneAnalysis}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-sm mb-1">Color Season</h5>
                <p className="text-sm text-slate-700">{response.analysis.skinAnalysisResults.colorSeason}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Best and Avoid Colors */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Best Colors</h4>
              <div className="flex flex-wrap gap-2">
                {response.analysis.skinAnalysisResults.bestColors.map((color, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Colors to Avoid</h4>
              <div className="flex flex-wrap gap-2">
                {response.analysis.skinAnalysisResults.avoidColors.map((color, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-50 text-red-700">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Style Recommendations */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Style Recommendations</h4>
            <div className="space-y-4">
              {Object.entries(response.analysis.styleRecommendations).map(([occasion, details]) => (
                <Card key={occasion} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-green-200 text-green-700 capitalize">
                        {occasion}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Clothing</h5>
                        <ul className="space-y-1">
                          {details.clothing.slice(0, 3).map((item, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Colors</h5>
                        <div className="flex flex-wrap gap-1">
                          {details.colors.map((color, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Accessories</h5>
                        <ul className="space-y-1">
                          {details.accessories.slice(0, 2).map((item, index) => (
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
            </div>
          </div>

          <Separator />

          {/* Personalized Tips */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Personalized Tips</h4>
            <div className="grid gap-4">
              {Object.entries(response.analysis.personalizedTips).map(([category, tips]) => (
                <div key={category} className="p-3 bg-slate-50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2 capitalize">{category}</h5>
                  <ul className="space-y-1">
                    {tips.slice(0, 3).map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* User Request Response */}
          {response.analysis.userRequestResponse && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Specific Response</h4>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {response.analysis.userRequestResponse}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Shopping Guide */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Shopping Guide</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-sm mb-2">Priority Items</h5>
                <ul className="space-y-1">
                  {response.analysis.shoppingGuide.priorityItems.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2">Budget Tips</h5>
                <ul className="space-y-1">
                  {response.analysis.shoppingGuide.budgetTips.slice(0, 3).map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
        <div className="max-w-4xl mx-auto space-y-6">
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
                className={`flex flex-col space-y-2 max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"
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

                {/* API Response */}
                {message.apiResponse && (
                  <>
                    <ExtractedFeaturesCard features={message.apiResponse.extractedFeatures} />
                    <AnalysisResponseCard response={message.apiResponse} />
                  </>
                )}

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
        <div className="max-w-4xl mx-auto">
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
