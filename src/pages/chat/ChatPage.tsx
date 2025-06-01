import { useState, useRef, useEffect } from "react"
import { Sparkles, Bot } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { useChatStorage, type Message } from "@/hooks/use-chat-storage"
import { LoadingOverlay } from "./loading-overlay"
import { StorageStatus } from "./storage-status"

export default function StyleScriptChat() {
  // Update the useChatStorage hook usage
  const {
    currentChat,
    updateChatMessages,
    createNewChat,
    isLoading,
    isSaving,
    lastSaved,
    autoSaveEnabled,
    toggleAutoSave,
    manualSave,
    storageWarning,
  } = useChatStorage()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Create initial chat if none exists
  useEffect(() => {
    if (!currentChat) {
      createNewChat()
    }
  }, [currentChat, createNewChat])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
  const callAnalysisAPI = async (imageData?: string, text?: string): Promise<any> => {
    const formData = new FormData()

    if (text) {
      formData.append("text", text)
    }

    if (imageData) {
      const blob = base64ToBlob(imageData)
      formData.append("image", blob, "image.jpg")
    }

    try {
      // const apiUrl = `${import.meta.env.VITE_API_URL}/analyze`
      // const apiUrl = `http://43.204.106.151:5000/analyze`
      const apiUrl = `http://localhost:5000/analyze`

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      console.log(apiUrl)
      console.log(response)

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

  const handleSendMessage = async (content: string, image?: string) => {
    if (!currentChat) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      image,
      type: image ? "analysis" : "text",
    }

    const updatedMessages = [...currentChat.messages, userMessage]
    updateChatMessages(currentChat.id, updatedMessages)
    setIsAnalyzing(true)

    try {
      // Call the actual API
      const apiResponse = await callAnalysisAPI(image, content)

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || "Analysis failed")
      }

      setCurrentAnalysis(apiResponse)

      // Extract metadata from the API response for storage
      const metadata: any = {}

      if (apiResponse.extractedFeatures) {
        if (apiResponse.extractedFeatures.skinTone) {
          metadata.skinTone = apiResponse.extractedFeatures.skinTone
        }

        if (apiResponse.extractedFeatures.skinUndertone) {
          metadata.skinUndertone = apiResponse.extractedFeatures.skinUndertone
        }

        if (apiResponse.extractedFeatures.colorSeason) {
          metadata.colorSeason = apiResponse.extractedFeatures.colorSeason
        }
      }

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

      const finalMessages = [...updatedMessages, responseMessage]
      updateChatMessages(currentChat.id, finalMessages, metadata)
    } catch (error) {
      console.error("Error processing request:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure the analysis service is running on localhost:5000 and try again.`,
        timestamp: new Date(),
        type: "error",
      }

      const finalMessages = [...updatedMessages, errorMessage]
      updateChatMessages(currentChat.id, finalMessages)
    } finally {
      setIsAnalyzing(false)
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

  if (!currentChat) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Welcome to StyleScript</h2>
            <p className="text-slate-600">Loading your style consultation...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Add the LoadingOverlay before the main content: */}
      <LoadingOverlay isVisible={isLoading} message="Restoring your style conversations..." />
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{currentChat.title}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600">
                    Created {new Date(currentChat.createdAt).toLocaleDateString()}
                  </p>
                  {currentChat.metadata?.skinTone && (
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {currentChat.metadata.skinTone}
                    </Badge>
                  )}
                  {currentChat.metadata?.colorSeason && (
                    <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                      {currentChat.metadata.colorSeason}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {/* Add StorageStatus to the header next to the existing badges: */}
            <div className="flex items-center space-x-2">
              <StorageStatus
                isLoading={isLoading}
                isSaving={isSaving}
                lastSaved={lastSaved}
                autoSaveEnabled={autoSaveEnabled}
                onToggleAutoSave={toggleAutoSave}
                onManualSave={manualSave}
                storageWarning={storageWarning}
              />
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                Real-time Analysis
              </Badge>
            </div>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="max-w-5xl mx-auto space-y-6">
            {currentChat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isAnalyzing && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} isAnalyzing={isAnalyzing} hasCurrentAnalysis={!!currentAnalysis} />

        {/* Context Indicator */}
        {currentAnalysis && currentAnalysis.extractedFeatures && currentAnalysis.extractedFeatures.skinToneRGB && (
          <div className="px-6 pb-2">
            <div className="max-w-5xl mx-auto flex items-center space-x-2 text-xs text-slate-500">
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: `rgb(${currentAnalysis.extractedFeatures.skinToneRGB.join(",")})` }}
              />
              <span>
                Current analysis: {currentAnalysis.extractedFeatures.skinTone} skin with{" "}
                {currentAnalysis.extractedFeatures.skinUndertone} undertones
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
