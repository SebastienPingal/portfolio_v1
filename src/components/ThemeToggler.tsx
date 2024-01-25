import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme()
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant='outline'>
      {theme === 'dark' ? (
          <SunIcon />
        ) : (
          <MoonIcon />
      )}
    </Button>
  )
}

export default ThemeToggler