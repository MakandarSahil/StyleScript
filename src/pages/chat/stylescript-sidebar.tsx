import { useState } from "react"
import { Plus, Sparkles, Camera, Trash2, MessageSquare, Download, Upload, AlertCircle, X } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useChatStorage } from "../../hooks/use-chat-storage"
import { StorageStatus } from "./storage-status"

export function StyleScriptSidebar() {
  const {
    chats,
    currentChatId,
    createNewChat,
    deleteChat,
    switchToChat,
    clearAllChats,
    exportChats,
    importChats,
    storageWarning,
    isLoading,
    isSaving,
    lastSaved,
    autoSaveEnabled,
    toggleAutoSave,
    manualSave,
  } = useChatStorage()
  const [showStorageWarning, setShowStorageWarning] = useState(true)

  const fileInputRef = useState<HTMLInputElement | null>(null)

  const handleNewChat = () => {
    createNewChat()
  }

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId)
  }

  const handleChatClick = (chatId: string) => {
    switchToChat(chatId)
  }

  const handleExportChats = () => {
    if (exportChats()) {
      // toast({
      //   title: "Chats exported",
      //   description: "Your conversations have been downloaded as a JSON file",
      // })
      console.log("export")
    } else {
      // toast({
      //   title: "Export failed",
      //   description: "There was an error exporting your conversations",
      //   variant: "destructive",
      // })
      console.log("not exported")
    }
  }

  const handleImportClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          if (importChats(content)) {
            // toast({
            //   title: "Chats imported",
            //   description: "Your conversations have been imported successfully",
            // })
            console.log(content)
          } else {
            // toast({
            //   title: "Import failed",
            //   description: "There was an error importing your conversations",
            //   variant: "destructive",
            // })
            console.log("hii")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearAllChats = () => {
    if (window.confirm("Are you sure you want to delete all chats? This cannot be undone.")) {
      clearAllChats()
      // toast({
      //   title: "All chats cleared",
      //   description: "All your conversations have been deleted",
      // })
      console.log("cleared")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "analysis":
        return <Camera className="h-3 w-3" />
      case "consultation":
        return <MessageSquare className="h-3 w-3" />
      default:
        return <Sparkles className="h-3 w-3" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "analysis":
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
            Analysis
          </Badge>
        )
      case "consultation":
        return (
          <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
            Consult
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
            Chat
          </Badge>
        )
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900">StyleScript</h1>
            <p className="text-xs text-slate-600">AI Style Assistant</p>
          </div>
        </div>
        <Button onClick={handleNewChat} className="w-full gap-2 bg-gradient-to-br bg-slate-900">
          <Plus className="h-4 w-4" />
          New Style Chat
        </Button>
        <StorageStatus
          isLoading={isLoading}
          isSaving={isSaving}
          lastSaved={lastSaved}
          autoSaveEnabled={autoSaveEnabled}
          onToggleAutoSave={toggleAutoSave}
          onManualSave={manualSave}
          storageWarning={storageWarning}
        />
      </SidebarHeader>

      <SidebarContent>
        {storageWarning && showStorageWarning && (
          <Alert className="mx-2 my-2 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs text-amber-700 flex-1">{storageWarning}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-amber-600"
              onClick={() => setShowStorageWarning(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        )}

        <ScrollArea className="h-[calc(100vh-200px)]">
          {/* Recent Chats */}
          <SidebarGroup>
            <div className="flex items-center justify-between px-2">
              <SidebarGroupLabel className="text-slate-500 font-medium">Recent Conversations</SidebarGroupLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <span className="sr-only">More options</span>
                    <div className="h-1 w-1 rounded-full bg-current" />
                    <div className="h-1 w-1 rounded-full bg-current" />
                    <div className="h-1 w-1 rounded-full bg-current" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportChats}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Chats
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Chats
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleClearAllChats} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Chats
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      className={`h-auto p-3 hover:bg-slate-50 ${currentChatId === chat.id ? "bg-purple-50 border-l-2 border-purple-500" : ""
                        }`}
                    >
                      <div
                        className="flex flex-col items-start gap-2 w-full cursor-pointer"
                        onClick={() => handleChatClick(chat.id)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {getTypeIcon(chat.type)}
                          <span className="font-medium truncate flex-1 text-sm">{chat.title}</span>
                          {currentChatId === chat.id && (
                            <Badge
                              variant="outline"
                              className="bg-purple-100 border-purple-300 text-purple-800 text-xs"
                            >
                              Active
                            </Badge>
                          )}
                        </div>
                        {chat.preview && <p className="text-xs text-slate-500 line-clamp-2 pl-5">{chat.preview}</p>}
                        <div className="flex items-center justify-between w-full pl-5">
                          <span className="text-xs text-slate-400">{formatTimestamp(chat.lastUpdated)}</span>
                          {getTypeBadge(chat.type)}
                        </div>

                        {/* Show metadata indicators if available */}
                        {chat.metadata && (
                          <div className="flex flex-wrap gap-1 pl-5">
                            {chat.metadata.skinTone && (
                              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                                {chat.metadata.skinTone}
                              </Badge>
                            )}
                            {chat.metadata.colorSeason && (
                              <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                                {chat.metadata.colorSeason}
                              </Badge>
                            )}
                            {chat.metadata.hasImageAnalysis && (
                              <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                                Image Analysis
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <span className="sr-only">More options</span>
                          <div className="h-1 w-1 rounded-full bg-current" />
                          <div className="h-1 w-1 rounded-full bg-current" />
                          <div className="h-1 w-1 rounded-full bg-current" />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
                {chats.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No conversations yet. Start a new chat to begin!
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200">
        <div className="flex items-center gap-3 p-2 mt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-slate-900 bg-blue-100">SS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Style Enthusiast</p>
            <p className="text-xs text-slate-500">
              {chats.length} {chats.length === 1 ? "conversation" : "conversations"}
            </p>
          </div>
          <Badge variant="outline" className="text-xs border-purple-200 text-blue-700">
            Pro
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
