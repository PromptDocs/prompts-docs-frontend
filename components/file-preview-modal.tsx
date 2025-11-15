"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AttachedFile } from "@/components/chat-provider"
import { FileSpreadsheet, FileText, File } from "lucide-react"
import * as XLSX from "xlsx"

interface FilePreviewModalProps {
  file: AttachedFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 엑셀 셀 값 타입
type CellValue = string | number | boolean | null

export function FilePreviewModal({ file, open, onOpenChange }: FilePreviewModalProps) {
  const [excelRows, setExcelRows] = useState<CellValue[][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 모달이 닫히거나 엑셀이 아니면 초기화
    if (!open || !file || file.type !== "excel" || !file.file) {
      setExcelRows([])
      setError(null)
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = event.target?.result
        if (!data) {
          throw new Error("파일 데이터를 읽을 수 없습니다.")
        }

        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // header: 1 -> 2차원 배열 형태로 읽음
        const rows = XLSX.utils.sheet_to_json<CellValue[]>(worksheet, { header: 1 })

        console.log(rows);

        // 너무 많으면 상위 N행 / N열만 보여주기 (미리보기니까)
        const MAX_ROWS = 100
        const MAX_COLS = 20

        const limited = rows
          .slice(0, MAX_ROWS)
          .map((row) => row.slice(0, MAX_COLS))

        setExcelRows(limited)
      } catch (e) {
        console.error(e)
        setError("엑셀 파일을 미리보는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setError("파일을 읽는 중 오류가 발생했습니다.")
      setLoading(false)
    }

    reader.readAsArrayBuffer(file.file)

    // file이 바뀔 때마다 다시 파싱
  }, [file, open])

  if (!file) return null

  const isExcel = file.type === "excel"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isExcel && <FileSpreadsheet className="h-5 w-5 text-green-600" />}
            {(file.type === "hwp" || file.type === "word") && (
              <FileText className="h-5 w-5 text-blue-600" />
            )}
            {file.type === "pdf" && <File className="h-5 w-5 text-red-600" />}
            {file.name}
          </DialogTitle>
        </DialogHeader>

        {/* 엑셀일 때 */}
        {isExcel ? (
          <div className="mt-2 flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Type: {file.type.toUpperCase()} • Size: {file.size}
            </p>

            {loading && (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                엑셀 파일을 불러오는 중입니다...
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {!loading && !error && excelRows.length === 0 && (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                미리보기에 표시할 데이터가 없습니다.
              </div>
            )}

            {!loading && !error && excelRows.length > 0 && (
              <div className="max-h-[480px] overflow-auto rounded-md border bg-background">
                <table className="min-w-full border-collapse text-xs">
                  <tbody>
                    {excelRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b last:border-b-0">
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            className="border-r last:border-r-0 px-2 py-1 align-top"
                          >
                            {cell as any}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-2 py-1 text-[10px] text-muted-foreground">
                  상위 {excelRows.length}행만 미리보기로 표시됩니다.
                </p>
              </div>
            )}
          </div>
        ) : (
          // 그 외 타입 (HWP, Word, PDF 등)
          <div className="rounded-lg border border-border bg-muted p-8 text-center">
            <p className="text-sm text-muted-foreground">
              이 파일 타입에 대한 미리보기는 아직 준비 중입니다.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Type: {file.type.toUpperCase()} • Size: {file.size}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
