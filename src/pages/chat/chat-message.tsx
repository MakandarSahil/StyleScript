import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Bot, Sparkles, AlertCircle } from "lucide-react"
import { TabbedAnalysisCard } from "./tabbed-analysis-card"
import type { Message } from "@/hooks/use-chat-storage"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex items-start space-x-3 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
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

      <div className={`flex flex-col space-y-2 max-w-[90%] ${message.role === "user" ? "items-end" : "items-start"}`}>
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

        {/* API Response with Analysis */}
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
  )
}
