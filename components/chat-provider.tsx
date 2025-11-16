"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createChatSession, searchExistingChatSession, sendMessage } from "@/lib/api/chat";

export type FileType = "excel" | "hwp" | "word" | "pdf";

export interface AttachedFile {
  id: string;
  name: string;
  type: FileType;
  isUploaded: boolean;
  size?: string;
  file?: File;
}

export interface TaskStep {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "completed" | "error";
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  fileGroupId: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  chatSessionId: string;
  chatSessionName: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null | undefined;
  messages: Message[];
  attachedFiles: AttachedFile[];
  taskProgress: TaskStep[];
  setCurrentSessionId: (id: string | null) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  addFile: (file: AttachedFile) => void;
  removeFile: (id: string) => void;
  updateTaskProgress: (steps: TaskStep[]) => void;
  createNewSession: () => void;
  triggerFileSelect: (inputRef: HTMLInputElement | null) => void;
  handleFileSelected: (fileList: FileList | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const triggerFileSelect = (input: HTMLInputElement | null) => {
    input?.click();
  };

  const handleFileSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const newAttached: AttachedFile = {
      id: Date.now().toString(),
      name: file.name,
      type: getFileType(file.name),
      isUploaded: false,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      file: file,
    };

    addFile(newAttached);
  };

  const getFileType = (filename: string): FileType => {
    const ext = filename.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "xlsx":
      case "xls":
        return "excel";
      case "hwp":
        return "hwp";
      case "doc":
      case "docx":
        return "word";
      case "pdf":
        return "pdf";
      default:
        return "pdf"; // fallback
    }
  };

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "안녕하세요! 무엇을 도와드릴까요?",
      fileGroupId: "",
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [taskProgress, setTaskProgress] = useState<TaskStep[]>([
    { id: "1", label: "Searching for Excel files...", status: "completed" },
    { id: "2", label: "Analyzing employment data...", status: "in-progress" },
    { id: "3", label: "Calculating averages...", status: "pending" },
    { id: "4", label: "Generating report...", status: "pending" },
  ]);

  const addMessage = async (message: Omit<Message, "id" | "timestamp">) => {
    // 만약 현재 선택된 채팅 세션이 없으면?
    if(!currentSessionId){
      // 새로운 채팅방을 먼저 만듦
      await createNewSession();

      console.log(currentSessionId);

      // 채팅방이 만들어졌으면 해당 채팅방에 채팅침
      const newMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      };

      await sendMessage({
        content: message.content,
        fileGroupId: message.fileGroupId
      });
      setMessages((prev) => [...prev, newMessage]);

    }
  };

  const addFile = (file: AttachedFile) => {
    setAttachedFiles((prev) => [...prev, file]);
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateTaskProgress = (steps: TaskStep[]) => {
    setTaskProgress(steps);
  };

  // 채팅 세션 리스트 불러오기
  const initializeChatSession = () => {
    searchExistingChatSession()
      .then((res) => {
        setSessions(res);
      })
  }

  // 새로운 채팅 세션 만들기(사이드바 왼쪽 '+' 눌렀을 때)
  const createNewSession = async() => {
    await createChatSession()
      .then((res) => {
        const newSession: ChatSession = {
          id: res.id,
          chatSessionId: res.chatSessionId,
          chatSessionName: res.chatSessionName,
          lastMessage: "",
          timestamp: res.createDt ? res.createDt : res.updateDt,
        };
        console.log(newSession);
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setMessages([]);
        setAttachedFiles([]);
        setTaskProgress([]);
      })
      .catch((err) => {
        console.error("새 채팅방 생성 오류:", err);
      });
  };

  useEffect(() => {
    initializeChatSession();
  }, [])

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
        triggerFileSelect,
        handleFileSelected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
