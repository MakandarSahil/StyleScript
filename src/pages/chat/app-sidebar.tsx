"use client"

import { useState } from "react"
import { Plus, MessageSquare, Settings, HelpCircle, Home, Trash2 } from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatItem {
  id: string
  title: string
  timestamp: string
  preview?: string
}

export function AppSidebar() {
  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: "1",
      title: "Understanding AI concepts",
      timestamp: "2 hours ago",
      preview: "Can you explain how neural networks work?",
    },
    {
      id: "2",
      title: "Project brainstorming",
      timestamp: "1 day ago",
      preview: "I need help with my startup idea...",
    },
    {
      id: "3",
      title: "Code review help",
      timestamp: "3 days ago",
      preview: "Could you review this React component?",
    },
    {
      id: "4",
      title: "Image analysis task",
      timestamp: "1 week ago",
      preview: "Analyze this architectural photo",
    },
  ])

  const handleNewChat = () => {
    const newChat: ChatItem = {
      id: Date.now().toString(),
      title: "New conversation",
      timestamp: "Just now",
      preview: "",
    }
    setChats([newChat, ...chats])
  }

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat.id !== chatId))
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MessageSquare className="h-4 w-4" />
          </div>
          <span className="font-semibold">AI Chat</span>
        </div>
        <Button onClick={handleNewChat} className="w-full gap-2 mt-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild className="h-auto p-3">
                      <div className="flex flex-col items-start gap-1 w-full">
                        <div className="flex items-center gap-2 w-full">
                          <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium truncate flex-1">{chat.title}</span>
                        </div>
                        {chat.preview && (
                          <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{chat.preview}</p>
                        )}
                        <span className="text-xs text-muted-foreground pl-6">{chat.timestamp}</span>
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
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle className="h-4 w-4" />
              <span>Help & FAQ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
