"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatContext } from "@/components/chat-provider"
import { FileList } from "@/components/file-list"
import { TaskProgress } from "@/components/task-progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Files, ListChecks } from "lucide-react"
import { useState } from "react"

function WorkspaceContent() {
  const { attachedFiles, taskProgress } = useChatContext()

  const handleContinue = () => {
    console.log("Continue button clicked - triggering backend execution")
    // This would trigger the backend MCP execution
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Workspace</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          <div>
            <h3 className="mb-3 text-xs font-medium text-muted-foreground">ATTACHED FILES</h3>
            <FileList files={attachedFiles} />
          </div>
          <div>
            <h3 className="mb-3 text-xs font-medium text-muted-foreground">TASK PROGRESS</h3>
            <TaskProgress steps={taskProgress} />
          </div>
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4">
        <Button onClick={handleContinue} className="w-full" size="lg">
          CONTINUE
        </Button>
      </div>
    </div>
  )
}

export function RightSidebar() {
  const [open, setOpen] = useState(false)
  const { attachedFiles, taskProgress } = useChatContext()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-80 border-l border-border lg:block">
        <WorkspaceContent />
      </aside>

      {/* Tablet/Mobile Tabs */}
      <div className="block border-l border-border lg:hidden">
        <Tabs defaultValue="files" className="flex h-full w-80 flex-col">
          <TabsList className="w-full rounded-none border-b border-border">
            <TabsTrigger value="files" className="flex-1">
              <Files className="mr-2 h-4 w-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">
              <ListChecks className="mr-2 h-4 w-4" />
              Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="files" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <FileList files={attachedFiles} />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="tasks" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <TaskProgress steps={taskProgress} />
              </div>
            </ScrollArea>
          </TabsContent>
          <div className="border-t border-border p-4">
            <Button className="w-full" size="lg">
              CONTINUE
            </Button>
          </div>
        </Tabs>
      </div>
    </>
  )
}
