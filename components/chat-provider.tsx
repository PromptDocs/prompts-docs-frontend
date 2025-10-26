"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type FileType = "excel" | "hwp" | "word" | "pdf"

export interface AttachedFile {
  id: string
  name: string
  type: FileType
  size?: string
}

export interface TaskStep {
  id: string
  label: string
  status: "pending" | "in-progress" | "completed" | "error"
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

interface ChatContextType {
  sessions: ChatSession[]
  currentSessionId: string | null
  messages: Message[]
  attachedFiles: AttachedFile[]
  taskProgress: TaskStep[]
  setCurrentSessionId: (id: string | null) => void
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  addFile: (file: AttachedFile) => void
  removeFile: (id: string) => void
  updateTaskProgress: (steps: TaskStep[]) => void
  createNewSession: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Employment Rate Analysis",
      lastMessage: "Calculate average from Excel files...",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      title: "Document Formatting",
      lastMessage: "Convert HWP to Word format...",
      timestamp: new Date(Date.now() - 7200000),
    },
  ])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>("1")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I can help you analyze and process documents. What would you like to do today?",
      timestamp: new Date(Date.now() - 3600000),
    },
  ])
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    {
      id: "1",
      name: "employment_data_2024.xlsx",
      type: "excel",
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "quarterly_report.hwp",
      type: "hwp",
      size: "1.8 MB",
    },
  ])
  const [taskProgress, setTaskProgress] = useState<TaskStep[]>([
    { id: "1", label: "Searching for Excel files...", status: "completed" },
    { id: "2", label: "Analyzing employment data...", status: "in-progress" },
    { id: "3", label: "Calculating averages...", status: "pending" },
    { id: "4", label: "Generating report...", status: "pending" },
  ])

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addFile = (file: AttachedFile) => {
    setAttachedFiles((prev) => [...prev, file])
  }

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const updateTaskProgress = (steps: TaskStep[]) => {
    setTaskProgress(steps)
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "",
      timestamp: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
    setAttachedFiles([])
    setTaskProgress([])
  }

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        messages,
        attachedFiles,
        taskProgress,
        setCurrentSessionId,
        addMessage,
        addFile,
        removeFile,
        updateTaskProgress,
        createNewSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider")
  }
  return context
}
