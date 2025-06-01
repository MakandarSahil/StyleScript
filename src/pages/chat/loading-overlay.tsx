"use client"

import { Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  progress?: number
}

export function LoadingOverlay({
  isVisible,
  message = "Loading your conversations...",
  progress,
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 border border-slate-200">
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">StyleScript</h2>
          <p className="text-slate-600 mb-4">{message}</p>

          {progress !== undefined && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-slate-500">{Math.round(progress)}% complete</p>
            </div>
          )}

          {progress === undefined && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
