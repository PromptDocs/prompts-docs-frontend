"use client";

import type React from "react";

import { FileSpreadsheet, FileText, File } from "lucide-react";
import type { AttachedFile, FileType } from "@/components/chat-provider";
import { useRef, useState } from "react";
import { FilePreviewModal } from "@/components/file-preview-modal";
import { useChatContext } from "@/components/chat-provider";
import { Button } from "./ui/button";
import { uploadFile } from "@/lib/api/file"

const fileIcons: Record<FileType, React.ReactNode> = {
  excel: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
  hwp: <FileText className="h-5 w-5 text-blue-600" />,
  word: <FileText className="h-5 w-5 text-blue-500" />,
  pdf: <File className="h-5 w-5 text-red-600" />,
};

interface FileListProps {
  files: AttachedFile[];
}

export function FileList({ files }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { triggerFileSelect, handleFileSelected } = useChatContext();

  if (files.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-border p-6 text-center hover:border-blue-500 select-none"
        onClick={() => triggerFileSelect(fileInputRef.current)}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileSelected(e.target.files)}
          accept=".xlsx"
        />
        <p className="text-sm text-muted-foreground">
          클릭하여 파일을 첨부해주세요
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => setSelectedFile(file)}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
              {fileIcons[file.type]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              {file.size && (
                <p className="text-xs text-muted-foreground">{file.size}</p>
              )}
            </div>
            <Button
              type="button"
              onClick={async (e) => {
                e.stopPropagation(); // 카드 click과 분리
                if (!file.file) return;
                await uploadFile(file.file);
              }}
            >
              upload
            </Button>
          </button>
        ))}
        <div
          className="rounded-lg border border-dashed border-border p-6 text-center hover:border-blue-500 select-none"
          onClick={() => triggerFileSelect(fileInputRef.current)}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files)}
            accept=".xlsx"
          />
          <p className="text-sm text-muted-foreground">
            클릭하여 파일을 첨부해주세요
          </p>
        </div>
      </div>
      <FilePreviewModal
        file={selectedFile}
        open={!!selectedFile}
        onOpenChange={(open) => !open && setSelectedFile(null)}
      />
    </>
  );
}
