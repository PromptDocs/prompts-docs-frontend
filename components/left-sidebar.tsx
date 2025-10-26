"use client"

import { Plus, MessageSquare, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatContext } from "@/components/chat-provider"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function SidebarContent() {
  const { sessions, currentSessionId, setCurrentSessionId, createNewSession } = useChatContext()

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Chat Sessions</h2>
        <Button size="icon" variant="ghost" onClick={createNewSession} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={cn(
                "flex w-full flex-col items-start gap-1 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                currentSessionId === session.id && "bg-accent",
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{session.title}</span>
              </div>
              <p className="line-clamp-1 text-xs text-muted-foreground">{session.lastMessage}</p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function LeftSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-border lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed left-4 top-16 z-40 h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
