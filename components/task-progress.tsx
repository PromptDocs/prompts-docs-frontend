"use client"

import { Check, Loader2, Circle, AlertCircle } from "lucide-react"
import type { TaskStep } from "@/components/chat-provider"
import { cn } from "@/lib/utils"

interface TaskProgressProps {
  steps: TaskStep[]
}

const statusIcons = {
  completed: <Check className="h-4 w-4 text-green-600" />,
  "in-progress": <Loader2 className="h-4 w-4 animate-spin text-primary" />,
  pending: <Circle className="h-4 w-4 text-muted-foreground" />,
  error: <AlertCircle className="h-4 w-4 text-destructive" />,
}

export function TaskProgress({ steps }: TaskProgressProps) {
  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">No tasks in progress</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-3">
          <div className="relative flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                step.status === "completed" && "border-green-600 bg-green-50 dark:bg-green-950",
                step.status === "in-progress" && "border-primary bg-primary/10",
                step.status === "pending" && "border-muted bg-muted",
                step.status === "error" && "border-destructive bg-destructive/10",
              )}
            >
              {statusIcons[step.status]}
            </div>
            {index < steps.length - 1 && (
              <div className={cn("mt-1 h-full w-0.5", step.status === "completed" ? "bg-green-600" : "bg-border")} />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p
              className={cn(
                "text-sm",
                step.status === "completed" && "text-foreground",
                step.status === "in-progress" && "font-medium text-foreground",
                step.status === "pending" && "text-muted-foreground",
                step.status === "error" && "text-destructive",
              )}
            >
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
