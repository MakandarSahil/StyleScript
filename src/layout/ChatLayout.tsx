import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { StyleScriptSidebar } from "@/pages/chat/stylescript-sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <StyleScriptSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  )
}
