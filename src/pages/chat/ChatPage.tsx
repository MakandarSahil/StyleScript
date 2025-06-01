"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Camera, Upload, X, Sparkles, Palette, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface SkinToneAnalysis {
  category: string
  undertone: string
  hex: string
  confidence: number
  description: string
  suggestedColors: Array<{
    name: string
    hex: string
    category: "primary" | "secondary" | "accent"
    suitability: number
  }>
}

interface GeminiResponse {
  styleRecommendations: string
  outfitSuggestions: Array<{
    occasion: string
    description: string
    items: string[]
    colorCombinations: string[]
  }>
  personalizedTips: string[]
  seasonalAdvice: string
  shoppingGuide: string
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  image?: string
  skinAnalysis?: SkinToneAnalysis
  geminiResponse?: GeminiResponse
  type: "text" | "analysis" | "recommendation" | "system"
}

export default function StyleScriptChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Welcome to StyleScript! I'm your AI style consultant powered by advanced image analysis and Gemini AI. Upload a photo of yourself to get started with personalized style recommendations, or ask me any fashion-related questions!",
      timestamp: new Date(),
      type: "system",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<SkinToneAnalysis | null>(null)
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

  // Simulated Python model for skin tone analysis
  const simulatePythonAnalysis = async (imageData: string): Promise<SkinToneAnalysis> => {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock analysis results
    const mockAnalysis: SkinToneAnalysis = {
      category: "Medium-Deep",
      undertone: "Warm Golden",
      hex: "#C8956D",
      confidence: 94,
      description:
        "Your skin has beautiful warm golden undertones with medium-deep richness. This creates a naturally radiant complexion that works beautifully with earth tones and jewel colors.",
      suggestedColors: [
        { name: "Deep Navy", hex: "#1E3A5F", category: "primary", suitability: 95 },
        { name: "Warm Ivory", hex: "#F8F6F0", category: "primary", suitability: 92 },
        { name: "Terracotta", hex: "#C65D07", category: "secondary", suitability: 98 },
        { name: "Forest Green", hex: "#2D5016", category: "secondary", suitability: 89 },
        { name: "Golden Yellow", hex: "#FFD700", category: "accent", suitability: 87 },
        { name: "Burgundy", hex: "#800020", category: "accent", suitability: 91 },
        { name: "Camel", hex: "#C19A6B", category: "secondary", suitability: 94 },
        { name: "Rust Orange", hex: "#B7410E", category: "accent", suitability: 88 },
      ],
    }

    return mockAnalysis
  }

  // Simulated Gemini API call
  const simulateGeminiAPI = async (skinAnalysis: SkinToneAnalysis, userInput: string): Promise<GeminiResponse> => {
    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock Gemini response based on skin analysis and user input
    const mockResponse: GeminiResponse = {
      styleRecommendations: `Based on your ${skinAnalysis.category.toLowerCase()} skin tone with ${skinAnalysis.undertone.toLowerCase()} undertones, you have a stunning natural warmth that's perfectly suited for rich, saturated colors. Your skin tone falls into the "Deep Autumn" color palette, which means you'll look absolutely radiant in earth tones, jewel colors, and warm metallics. ${userInput
        ? `Considering your specific request about "${userInput}", I've tailored these recommendations to match your preferences.`
        : ""
        }`,
      outfitSuggestions: [
        {
          occasion: "Professional/Business",
          description:
            "Create a powerful, sophisticated look that commands respect while honoring your warm undertones.",
          items: [
            "Structured blazer in deep navy or charcoal",
            "Silk blouse in warm ivory or champagne",
            "Tailored trousers in rich brown or navy",
            "Gold-toned accessories and jewelry",
            "Leather pumps in cognac or black",
          ],
          colorCombinations: ["#1E3A5F + #F8F6F0 + #FFD700", "#2F2F2F + #C19A6B + #800020"],
        },
        {
          occasion: "Casual/Weekend",
          description: "Effortless elegance that feels comfortable while maintaining your polished aesthetic.",
          items: [
            "Cashmere sweater in camel, rust, or forest green",
            "Dark wash jeans with warm undertones",
            "Cognac leather boots or sneakers",
            "Scarf in autumn-inspired prints",
            "Crossbody bag in warm brown leather",
          ],
          colorCombinations: ["#C19A6B + #2F4F4F + #B7410E", "#2D5016 + #F8F6F0 + #FFD700"],
        },
        {
          occasion: "Evening/Special Events",
          description: "Show-stopping looks that enhance your natural radiance for memorable occasions.",
          items: [
            "Midi or maxi dress in emerald, burgundy, or terracotta",
            "Metallic heels in gold, bronze, or copper",
            "Statement jewelry with warm-toned stones",
            "Clutch in nude, gold, or matching dress color",
            "Wrap or shawl in complementary warm tone",
          ],
          colorCombinations: ["#800020 + #FFD700 + #C8956D", "#2D5016 + #C65D07 + #F8F6F0"],
        },
      ],
      personalizedTips: [
        "Your warm golden undertones mean gold jewelry will always be more flattering than silver - invest in quality gold pieces that you can mix and match.",
        "When shopping, hold items near your face in natural light to see how they interact with your skin tone - you'll immediately notice which colors make you glow.",
        "For makeup, choose warm-toned foundations with golden or yellow undertones, and opt for eyeshadows in bronze, copper, and warm brown shades.",
        "Your hair color should complement your warm undertones - consider warm browns, auburn highlights, or golden blonde tones rather than ash or cool colors.",
        "Build your wardrobe around a core palette of navy, warm ivory, camel, and forest green - these will serve as the foundation for countless outfit combinations.",
        "Don't be afraid of bold colors! Your skin tone can handle rich, saturated hues that might overwhelm cooler undertones.",
      ],
      seasonalAdvice:
        "As someone with Deep Autumn coloring, you're perfectly aligned with fall fashion trends. Embrace the season's rich color palette - think burnt orange, deep burgundy, golden yellow, and forest green. Layer different textures like wool, cashmere, and leather in your color palette for visual interest. In spring and summer, look for warmer versions of lighter colors rather than cool pastels.",
      shoppingGuide:
        "When building your wardrobe, prioritize quality over quantity. Invest in well-made pieces in your core colors that can be mixed and matched. Look for natural fabrics like wool, silk, and cotton in rich, saturated colors. Avoid cool-toned colors like icy blue, pure white, or silver - instead, opt for warm whites, navy instead of royal blue, and gold instead of silver accessories.",
    }

    return mockResponse
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
    setInputMessage("")
    setImagePreview(null)
    setIsAnalyzing(true)

    try {
      if (userMessage.image) {
        // Step 1: Python model analysis
        const skinAnalysis = await simulatePythonAnalysis(userMessage.image)
        setCurrentAnalysis(skinAnalysis)

        // Add analysis results message
        const analysisMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I've analyzed your photo using our advanced skin tone detection model. Here are the results:`,
          timestamp: new Date(),
          skinAnalysis,
          type: "analysis",
        }
        setMessages((prev) => [...prev, analysisMessage])

        // Step 2: Gemini API call with analysis results
        const geminiResponse = await simulateGeminiAPI(skinAnalysis, userMessage.content)

        // Add Gemini response message
        const geminiMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Based on your skin tone analysis, here are my personalized style recommendations:",
          timestamp: new Date(),
          geminiResponse,
          type: "recommendation",
        }
        setMessages((prev) => [...prev, geminiMessage])
      } else {
        // Regular conversation with context of previous analysis
        let responseContent = ""

        if (currentAnalysis) {
          // Use current analysis context for follow-up questions
          const contextualResponse = await simulateGeminiAPI(currentAnalysis, inputMessage)
          responseContent = `Based on your ${currentAnalysis.category.toLowerCase()} skin tone with ${currentAnalysis.undertone.toLowerCase()} undertones, here's my advice: ${contextualResponse.styleRecommendations
            }`

          const contextualMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: responseContent,
            timestamp: new Date(),
            geminiResponse: contextualResponse,
            type: "recommendation",
          }
          setMessages((prev) => [...prev, contextualMessage])
        } else {
          // General style advice without analysis
          responseContent = generateGeneralStyleAdvice(inputMessage)

          const generalMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: responseContent,
            timestamp: new Date(),
            type: "text",
          }
          setMessages((prev) => [...prev, generalMessage])
        }
      }
    } catch (error) {
      console.error("Error processing request:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateGeneralStyleAdvice = (query: string): string => {
    const responses = [
      "Great question! When building a versatile wardrobe, focus on quality basics in neutral colors that can be mixed and matched. Consider your lifestyle and invest in pieces that work for multiple occasions.",
      "Color coordination is key to looking polished. Start with a base color and add one or two complementary colors. Neutrals like navy, black, white, and beige are great foundations.",
      "For professional settings, opt for well-fitted pieces in classic silhouettes. A good blazer, quality trousers, and comfortable yet stylish shoes are essential investments.",
      "Accessorizing can transform any outfit. A statement necklace, quality handbag, or stylish scarf can elevate even the simplest look.",
      "When shopping, consider your body type and personal style preferences. What matters most is that you feel confident and comfortable in what you wear.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
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
          <span className="text-sm text-slate-600">
            {imagePreview ? "Analyzing your photo..." : "Generating recommendations..."}
          </span>
        </div>
      </div>
    </div>
  )

  const SkinAnalysisCard = ({ analysis }: { analysis: SkinToneAnalysis }) => (
    <Card className="mt-3 border-purple-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Skin Tone Analysis</h3>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            {analysis.confidence}% Confidence
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: analysis.hex }}
              />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    {analysis.category}
                  </Badge>
                  <Badge variant="outline" className="border-purple-200">
                    {analysis.undertone}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 font-mono">{analysis.hex}</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{analysis.description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Recommended Colors</h4>
            <div className="space-y-3">
              {analysis.suggestedColors.slice(0, 6).map((color, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{color.name}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${color.category === "primary"
                          ? "bg-blue-50 text-blue-700"
                          : color.category === "secondary"
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                          }`}
                      >
                        {color.category}
                      </Badge>
                    </div>
                    <Progress value={color.suitability} className="h-1 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const GeminiResponseCard = ({ response }: { response: GeminiResponse }) => (
    <Card className="mt-3 border-green-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-slate-900">AI Style Recommendations</h3>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            Powered by Gemini
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Style Recommendations */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Personal Style Analysis</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{response.styleRecommendations}</p>
          </div>

          <Separator />

          {/* Outfit Suggestions */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Outfit Suggestions</h4>
            <div className="space-y-4">
              {response.outfitSuggestions.map((outfit, index) => (
                <Card key={index} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        {outfit.occasion}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 italic">{outfit.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Key Pieces:</h5>
                        <ul className="space-y-1">
                          {outfit.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Color Combinations:</h5>
                        <div className="space-y-2">
                          {outfit.colorCombinations.map((combo, comboIndex) => (
                            <div key={comboIndex} className="flex items-center space-x-2">
                              {combo.split(" + ").map((color, colorIndex) => (
                                <div key={colorIndex} className="flex items-center space-x-1">
                                  <div
                                    className="w-4 h-4 rounded-full border border-slate-300"
                                    style={{ backgroundColor: color }}
                                  />
                                  {colorIndex < combo.split(" + ").length - 1 && (
                                    <span className="text-xs text-slate-400">+</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
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
            <div className="grid gap-3">
              {response.personalizedTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Seasonal Advice */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Seasonal Styling</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{response.seasonalAdvice}</p>
          </div>

          <Separator />

          {/* Shopping Guide */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Shopping Guide</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{response.shoppingGuide}</p>
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
              <p className="text-sm text-slate-600">Powered by Advanced AI & Computer Vision</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-50 text-purple-700">
              Python + Gemini AI
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
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  }
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : message.role === "system" ? (
                    <Sparkles className="h-4 w-4" />
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

                {/* Skin Analysis Results */}
                {message.skinAnalysis && <SkinAnalysisCard analysis={message.skinAnalysis} />}

                {/* Gemini Response */}
                {message.geminiResponse && <GeminiResponseCard response={message.geminiResponse} />}

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {message.type === "analysis" && (
                    <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      Python Analysis
                    </Badge>
                  )}
                  {message.type === "recommendation" && (
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                      Gemini AI
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

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="h-16 w-16 rounded-lg overflow-hidden border border-purple-300">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-900">Image ready for analysis</p>
                <p className="text-xs text-purple-700">
                  Our Python model will analyze your skin tone and Gemini AI will provide personalized recommendations
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
                  : "Upload a photo for skin tone analysis, or ask me any style-related questions..."
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
                style={{ backgroundColor: currentAnalysis.hex }}
              />
              <span>
                Current analysis: {currentAnalysis.category} skin with {currentAnalysis.undertone.toLowerCase()}{" "}
                undertones
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
