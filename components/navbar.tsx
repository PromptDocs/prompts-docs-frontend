"use client"

import { FileText, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { LoginModal } from "@/components/login-modal"

export function Navbar() {
  const [isDark, setIsDark] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  return (
    <>
      <nav className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">PromptDoc</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setShowLogin(true)}>Login</Button>
        </div>
      </nav>
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </>
  )
}
