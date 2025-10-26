"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatContext } from "@/components/chat-provider"
import { PromptInput } from "@/components/prompt-input"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

export function ChatArea() {
  const { messages } = useChatContext()

  return (
    <main className="flex flex-1 flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-4 py-3",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4">
        <div className="mx-auto max-w-3xl">
          <PromptInput />
        </div>
      </div>
    </main>
  )
}
