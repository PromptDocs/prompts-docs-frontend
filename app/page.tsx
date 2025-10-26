import { ChatProvider } from "@/components/chat-provider"
import { Navbar } from "@/components/navbar"
import { LeftSidebar } from "@/components/left-sidebar"
import { ChatArea } from "@/components/chat-area"
import { RightSidebar } from "@/components/right-sidebar"

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <ChatArea />
          <RightSidebar />
        </div>
      </div>
    </ChatProvider>
  )
}
