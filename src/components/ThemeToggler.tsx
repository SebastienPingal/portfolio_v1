'use client'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import { useState, useEffect } from "react"

const ThemeToggler = ({className}: {className?: string}) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant='outline' className={className}>
      {theme === 'dark' ? (
          <SunIcon />
        ) : (
          <MoonIcon />
      )}
    </Button>
  )
}

export default ThemeToggler