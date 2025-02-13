'use client'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import { useState, useEffect } from "react"

const ThemeToggler = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant='ghost' size='icon' className={className + ' rounded-full'}>
      {theme === 'dark' ? (
        <MoonIcon className="h-6" />
      ) : (
        <SunIcon className="h-6" />
      )}
    </Button>
  )
}

export default ThemeToggler