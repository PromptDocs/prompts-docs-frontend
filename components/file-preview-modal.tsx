"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AttachedFile } from "@/components/chat-provider"
import { FileSpreadsheet, FileText, File } from "lucide-react"

interface FilePreviewModalProps {
  file: AttachedFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilePreviewModal({ file, open, onOpenChange }: FilePreviewModalProps) {
  if (!file) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {file.type === "excel" && <FileSpreadsheet className="h-5 w-5 text-green-600" />}
            {(file.type === "hwp" || file.type === "word") && <FileText className="h-5 w-5 text-blue-600" />}
            {file.type === "pdf" && <File className="h-5 w-5 text-red-600" />}
            {file.name}
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-lg border border-border bg-muted p-8 text-center">
          <p className="text-sm text-muted-foreground">File preview would be displayed here</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Type: {file.type.toUpperCase()} • Size: {file.size}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
