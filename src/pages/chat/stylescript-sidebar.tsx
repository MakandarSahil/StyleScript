import { useState } from "react"
import {
  Plus,
  Sparkles,
  Camera,
  Trash2,
  MessageSquare,
} from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatSession {
  id: string
  title: string
  timestamp: string
  preview: string
  type: "analysis" | "consultation" | "general"
}

// interface StyleCategory {
//   id: string
//   name: string
//   icon: React.ReactNode
//   description: string
//   trending?: boolean
// }

// interface TrendingLook {
//   id: string
//   title: string
//   category: string
//   likes: number
//   image: string
// }

export function StyleScriptSidebar() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Autumn Color Analysis",
      timestamp: "2 hours ago",
      preview: "Analyzed warm undertones and suggested earth tones...",
      type: "analysis",
    },
    {
      id: "2",
      title: "Professional Wardrobe",
      timestamp: "1 day ago",
      preview: "Discussed blazer styles for corporate settings...",
      type: "consultation",
    },
    {
      id: "3",
      title: "Evening Wear Styling",
      timestamp: "3 days ago",
      preview: "Recommended elegant dress options for gala...",
      type: "consultation",
    },
    {
      id: "4",
      title: "Casual Weekend Look",
      timestamp: "1 week ago",
      preview: "Suggested comfortable yet stylish combinations...",
      type: "general",
    },
  ])

  // const styleCategories: StyleCategory[] = [
  //   {
  //     id: "skin-analysis",
  //     name: "Skin Tone Analysis",
  //     icon: <Palette className="h-4 w-4" />,
  //     description: "Discover your perfect color palette",
  //     trending: true,
  //   },
  //   {
  //     id: "wardrobe-essentials",
  //     name: "Wardrobe Essentials",
  //     icon: <Shirt className="h-4 w-4" />,
  //     description: "Build your capsule wardrobe",
  //   },
  //   {
  //     id: "seasonal-trends",
  //     name: "Seasonal Trends",
  //     icon: <TrendingUp className="h-4 w-4" />,
  //     description: "Latest fashion trends",
  //     trending: true,
  //   },
  //   {
  //     id: "luxury-styling",
  //     name: "Luxury Styling",
  //     icon: <Crown className="h-4 w-4" />,
  //     description: "Premium fashion guidance",
  //   },
  //   {
  //     id: "occasion-wear",
  //     name: "Occasion Wear",
  //     icon: <Star className="h-4 w-4" />,
  //     description: "Perfect outfits for every event",
  //   },
  // ]

  // const trendingLooks: TrendingLook[] = [
  //   {
  //     id: "1",
  //     title: "Warm Autumn Palette",
  //     category: "Color Analysis",
  //     likes: 1247,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: "2",
  //     title: "Minimalist Chic",
  //     category: "Capsule Wardrobe",
  //     likes: 892,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: "3",
  //     title: "Power Dressing",
  //     category: "Professional",
  //     likes: 756,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  // ]

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Style Consultation",
      timestamp: "Just now",
      preview: "",
      type: "general",
    }
    setChatSessions([newChat, ...chatSessions])
  }

  const handleDeleteChat = (chatId: string) => {
    setChatSessions(chatSessions.filter((chat) => chat.id !== chatId))
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
        <Button
          onClick={handleNewChat}
          className="w-full gap-2 bg-gradient-to-br bg-slate-900"
        >
          <Plus className="h-4 w-4" />
          New Style Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {/* Recent Chats */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-500 font-medium">Recent Conversations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatSessions.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild className="h-auto p-3 hover:bg-slate-50">
                      <div className="flex flex-col items-start gap-2 w-full">
                        <div className="flex items-center gap-2 w-full">
                          {getTypeIcon(chat.type)}
                          <span className="font-medium truncate flex-1 text-sm">{chat.title}</span>
                        </div>
                        {chat.preview && <p className="text-xs text-slate-500 line-clamp-2 pl-5">{chat.preview}</p>}
                        <div className="flex items-center justify-between w-full pl-5">
                          <span className="text-xs text-slate-400">{chat.timestamp}</span>
                          {getTypeBadge(chat.type)}
                        </div>
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
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Style Categories */}
          {/* <SidebarGroup>
            <SidebarGroupLabel className="text-slate-500 font-medium">Style Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {styleCategories.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton className="hover:bg-slate-50">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{category.name}</span>
                            {category.trending && (
                              <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-xs">
                                Trending
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">{category.description}</p>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}

          {/* Trending Looks */}
          {/* <SidebarGroup>
            <SidebarGroupLabel className="text-slate-500 font-medium">Trending Looks</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {trendingLooks.map((look) => (
                  <SidebarMenuItem key={look.id}>
                    <SidebarMenuButton className="h-auto p-3 hover:bg-slate-50">
                      <div className="flex items-center gap-3 w-full">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100">
                          <img
                            src={look.image || "/placeholder.svg"}
                            alt={look.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{look.title}</p>
                          <p className="text-xs text-slate-500">{look.category}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-slate-500">{look.likes.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}

          {/* Brand Promotions */}
          {/* <SidebarGroup>
            <SidebarGroupLabel className="text-slate-500 font-medium">Featured</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 mx-2">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-sm text-purple-900">Premium Styling</span>
                </div>
                <p className="text-xs text-purple-700 mb-3">Get personalized styling sessions with our AI experts</p>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-xs">
                  Upgrade Now
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup> */}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200">
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-slate-50">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-slate-50">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-slate-50">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}

        <div className="flex items-center gap-3 p-2 mt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-slate-900 bg-blue-100">SS</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Style Enthusiast</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
          <Badge variant="outline" className="text-xs border-purple-200 text-blue-700">
            Pro
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
