"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChatContext } from "@/components/chat-provider"

import { sendMessage } from "@/lib/api/chat";

export function PromptInput() {
  const [input, setInput] = useState("")
  const { addMessage } = useChatContext()

  // 채팅창에서 채팅을 입력했을 때 실행
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const response = await sendMessage({
      'content': input,
      'fileGroupId': null
    });

    addMessage({ role: "user", content: input, fileGroupId: "" })
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: response.answer,
        fileGroupId: ""
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
