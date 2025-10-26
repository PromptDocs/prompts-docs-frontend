"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChatContext } from "@/components/chat-provider"

export function PromptInput() {
  const [input, setInput] = useState("")
  const { addMessage } = useChatContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    addMessage({ role: "user", content: input })
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content:
          "I've found the relevant files and I'm ready to process them. Please review the files in the workspace and click CONTINUE to proceed.",
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Calculate average from Excel, convert HWP formatting, summarize docs…"
        className="min-h-[60px] resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <Button type="submit" size="icon" className="h-[60px] w-[60px] shrink-0">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}
