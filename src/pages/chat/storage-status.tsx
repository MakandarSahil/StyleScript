import { useState, useEffect } from "react"
import { Save, AlertCircle, CheckCircle, Clock, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface StorageStatusProps {
  isLoading: boolean
  isSaving: boolean
  lastSaved: Date | null
  autoSaveEnabled: boolean
  onToggleAutoSave: () => void
  onManualSave: () => void
  storageWarning?: string | null
}

export function StorageStatus({
  isLoading,
  isSaving,
  lastSaved,
  autoSaveEnabled,
  onToggleAutoSave,
  onManualSave,
  storageWarning,
}: StorageStatusProps) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    if (!lastSaved) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)

      if (diffInSeconds < 60) {
        setTimeAgo("Just now")
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        setTimeAgo(`${minutes}m ago`)
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        setTimeAgo(`${hours}h ago`)
      } else {
        setTimeAgo(lastSaved.toLocaleDateString())
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [lastSaved])

  const getStatusIcon = () => {
    if (isLoading) {
      return <Clock className="h-3 w-3 animate-spin" />
    }
    if (isSaving) {
      return <Save className="h-3 w-3 animate-pulse" />
    }
    if (storageWarning) {
      return <AlertCircle className="h-3 w-3 text-amber-600" />
    }
    return <CheckCircle className="h-3 w-3 text-green-600" />
  }

  const getStatusText = () => {
    if (isLoading) return "Loading..."
    if (isSaving) return "Saving..."
    if (storageWarning) return "Warning"
    return "Saved"
  }

  const getStatusColor = () => {
    if (isLoading || isSaving) return "bg-blue-50 text-blue-700 border-blue-200"
    if (storageWarning) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-green-50 text-green-700 border-green-200"
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
              <div className="flex items-center gap-1">
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              {isLoading && <p>Loading chat data...</p>}
              {isSaving && <p>Saving changes...</p>}
              {storageWarning && <p>{storageWarning}</p>}
              {!isLoading && !isSaving && !storageWarning && (
                <div>
                  <p>All changes saved</p>
                  {lastSaved && <p className="text-slate-500">Last saved: {timeAgo}</p>}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggleAutoSave}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${autoSaveEnabled ? "bg-green-500" : "bg-gray-400"}`} />
                <span>Auto-save {autoSaveEnabled ? "On" : "Off"}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onManualSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Save Now
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  )
}
