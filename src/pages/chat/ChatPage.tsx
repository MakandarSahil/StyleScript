import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Camera, Upload, X, Sparkles, Palette, Shirt, Crown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  image?: string
  analysis?: StyleAnalysis
  type?: "welcome" | "analysis" | "conversation" | "suggestion"
}

interface StyleAnalysis {
  skinTone: {
    category: string
    undertone: string
    hex: string
    confidence: number
    description: string
  }
  colorAnalysis: {
    dominantColors: Array<{ name: string; hex: string; percentage: number }>
    seasonalType: string
    colorHarmony: string
    recommendations: string[]
  }
  styleRecommendations: {
    personalityProfile: string
    outfitSuggestions: Array<{
      occasion: string
      items: string[]
      colors: string[]
      reasoning: string
    }>
    colorPairings: Array<{ primary: string; secondary: string; accent: string }>
    professionalTips: string[]
  }
}

export default function StyleScriptChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI style assistant. I can analyze your skin tone, suggest colors that complement you, and provide personalized style recommendations. Upload a photo to get started, or ask me any style-related questions!",
      timestamp: new Date(),
      type: "welcome",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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

  const generateStyleAnalysis = (): StyleAnalysis => {
    return {
      skinTone: {
        category: "Medium-Deep",
        undertone: "Warm Golden",
        hex: "#C8956D",
        confidence: 94,
        description:
          "Your skin has beautiful warm golden undertones with medium-deep richness that creates a naturally radiant complexion.",
      },
      colorAnalysis: {
        dominantColors: [
          { name: "Deep Navy", hex: "#1E3A5F", percentage: 32 },
          { name: "Warm Ivory", hex: "#F8F6F0", percentage: 28 },
          { name: "Terracotta", hex: "#C65D07", percentage: 22 },
          { name: "Forest Green", hex: "#2D5016", percentage: 18 },
        ],
        seasonalType: "Deep Autumn",
        colorHarmony: "Warm & Rich",
        recommendations: [
          "Rich, saturated colors enhance your natural warmth",
          "Earth tones and jewel tones are your power colors",
          "Avoid cool pastels and icy undertones",
          "Gold metallics complement your undertones perfectly",
        ],
      },
      styleRecommendations: {
        personalityProfile:
          "Your color choices suggest a confident, sophisticated individual who appreciates timeless elegance with modern touches. You likely gravitate toward quality over quantity and prefer versatile pieces that can transition from professional to social settings.",
        outfitSuggestions: [
          {
            occasion: "Professional",
            items: [
              "Structured blazer in navy",
              "Silk blouse in champagne",
              "Tailored trousers in charcoal",
              "Gold statement jewelry",
            ],
            colors: ["#1E3A5F", "#F8F6F0", "#2F2F2F", "#D4AF37"],
            reasoning: "These pieces create authority while honoring your warm undertones and sophisticated aesthetic.",
          },
          {
            occasion: "Casual",
            items: ["Cashmere sweater in camel", "Dark wash denim", "Cognac leather boots", "Autumn-inspired scarf"],
            colors: ["#C19A6B", "#2F4F4F", "#8B4513", "#CD853F"],
            reasoning:
              "Elevated casual pieces that maintain your polished look while feeling comfortable and authentic.",
          },
          {
            occasion: "Evening",
            items: ["Midi dress in emerald", "Bronze metallic heels", "Statement earrings", "Clutch in nude"],
            colors: ["#50C878", "#CD7F32", "#D4AF37", "#F5DEB3"],
            reasoning:
              "These choices create stunning visual impact while complementing your natural coloring beautifully.",
          },
        ],
        colorPairings: [
          { primary: "#1E3A5F", secondary: "#C8956D", accent: "#D4AF37" },
          { primary: "#2D5016", secondary: "#F8F6F0", accent: "#C65D07" },
          { primary: "#8B4513", secondary: "#F5DEB3", accent: "#CD853F" },
        ],
        professionalTips: [
          "Invest in quality basics in your core colors - they'll serve as the foundation for countless outfits",
          "When shopping, hold items near your face to see how they interact with your skin tone",
          "Your warm undertones mean gold jewelry will always be more flattering than silver",
          "Consider warm-toned makeup palettes with bronze, copper, and warm brown shades",
          "For hair color, warm browns, auburn highlights, or golden tones will enhance your natural beauty",
        ],
      },
    }
  }

  const generateConversationResponse = (query: string): string => {
    const responses = [
      "Based on your warm undertones, I'd recommend incorporating more earth tones and jewel colors into your wardrobe. Colors like terracotta, olive green, and deep burgundy would look stunning on you.",
      "For professional settings, try pairing a structured navy blazer with a cream silk blouse. The contrast will enhance your natural coloring while maintaining a sophisticated look.",
      "When choosing accessories, gold-toned jewelry will complement your warm undertones beautifully. Look for pieces with amber, topaz, or citrine stones for an especially harmonious look.",
      "Your skin tone would be enhanced by makeup in warm, golden hues. Consider bronze eyeshadows, peach or terracotta blushes, and warm-toned lipsticks in brick red or copper.",
      "For casual outfits, try combining dark wash jeans with sweaters in camel, rust, or forest green. These colors will enhance your natural warmth while keeping your look effortlessly stylish.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !imagePreview) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      image: imagePreview || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setImagePreview(null)
    setIsLoading(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate AI response
    if (userMessage.image) {
      // Image analysis response
      const analysis = generateStyleAnalysis()
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I've analyzed your photo and created a comprehensive style profile for you! Based on your skin tone and features, I've identified your color palette and created personalized recommendations. Explore the detailed analysis below:",
        timestamp: new Date(),
        analysis,
        type: "analysis",
      }
      setMessages((prev) => [...prev, aiResponse])
    } else {
      // Conversation response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateConversationResponse(inputMessage),
        timestamp: new Date(),
        type: "conversation",
      }
      setMessages((prev) => [...prev, aiResponse])
    }

    setIsLoading(false)
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
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback className="bg-blue-100 text-white">SS</AvatarFallback>
      </Avatar>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-slate-500">Analyzing your style...</span>
        </div>
      </div>
    </div>
  )

  const StyleAnalysisCard = ({ analysis }: { analysis: StyleAnalysis }) => (
    <Card className="mt-3 border-slate-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Your Style Analysis</h3>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="outfits">Outfits</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Skin Tone Analysis
                  </h4>
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: analysis.skinTone.hex }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          {analysis.skinTone.category}
                        </Badge>
                        <Badge variant="outline" className="border-blue-200">
                          {analysis.skinTone.undertone}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{analysis.skinTone.confidence}% confidence</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{analysis.skinTone.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Color Profile</h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-gradient-to-r from-blue-600 to-pink-600 text-white">
                      {analysis.colorAnalysis.seasonalType}
                    </Badge>
                    <span className="text-sm text-slate-600">{analysis.colorAnalysis.colorHarmony}</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.colorAnalysis.dominantColors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border border-slate-200"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium">{color.name}</span>
                            <span className="text-slate-500">{color.percentage}%</span>
                          </div>
                          <Progress value={color.percentage} className="h-1 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Recommended Color Palettes</h4>
              <div className="grid grid-cols-3 gap-4">
                {analysis.styleRecommendations.colorPairings.map((palette, index) => (
                  <Card key={index} className="border-slate-200">
                    <CardContent className="p-4">
                      <h5 className="font-medium text-sm mb-3">Palette {index + 1}</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded-md border border-slate-200"
                            style={{ backgroundColor: palette.primary }}
                          />
                          <span className="text-xs">Primary</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded-md border border-slate-200"
                            style={{ backgroundColor: palette.secondary }}
                          />
                          <span className="text-xs">Secondary</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded-md border border-slate-200"
                            style={{ backgroundColor: palette.accent }}
                          />
                          <span className="text-xs">Accent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Color Guidelines</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {analysis.colorAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <p className="text-sm text-slate-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outfits" className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Outfit Recommendations</h4>
              <div className="space-y-6">
                {analysis.styleRecommendations.outfitSuggestions.map((outfit, index) => (
                  <Card key={index} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {outfit.occasion === "Professional" && <Shirt className="h-4 w-4 text-slate-600" />}
                        {outfit.occasion === "Casual" && <TrendingUp className="h-4 w-4 text-slate-600" />}
                        {outfit.occasion === "Evening" && <Crown className="h-4 w-4 text-slate-600" />}
                        <h5 className="font-semibold text-slate-900">{outfit.occasion}</h5>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 italic">{outfit.reasoning}</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {outfit.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                            <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                            <span className="text-sm text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        {outfit.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Professional Styling Tips</h4>
              <div className="space-y-3">
                {analysis.styleRecommendations.professionalTips.map((tip, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-600 border-t-0 border-r-0 border-b-0">
                    <CardContent className="p-4">
                      <p className="text-sm text-slate-700">{tip}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-3">
          <SidebarTrigger />
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Style Consultation</h1>
            <p className="text-sm text-slate-600">AI-powered style analysis and recommendations</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback
                  className={
                    message.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-blue-100 text-black"
                  }
                >
                  {message.role === "user" ? "U" : "SS"}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col space-y-2 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 shadow-sm"
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.analysis && <StyleAnalysisCard analysis={message.analysis} />}

                <span className="text-xs text-slate-500">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4 sticky bottom-0">
        <div className="max-w-6xl mx-auto">
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
            <div className="mb-3 flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="h-16 w-16 rounded-lg overflow-hidden border border-slate-300">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">Image ready for analysis</p>
                <p className="text-xs text-slate-500">Send your message to receive style recommendations</p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeImage} className="h-8 w-8 text-slate-500">
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
              placeholder="Ask about your style, upload a photo for analysis, or request outfit recommendations..."
              className="min-h-[80px] pr-24 resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400"
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={triggerCameraInput}
                className="h-8 w-8 text-slate-500 hover:text-blue-600"
                disabled={isLoading}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={triggerFileInput}
                className="h-8 w-8 text-slate-500 hover:text-blue-600"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !imagePreview) || isLoading}
                className="h-8 w-8 bg-black "
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
