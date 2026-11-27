'use client'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette as PaletteIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { usePalette } from "./PaletteProvider"
import { PALETTES, type Palette } from "@/lib/palette"

// 🎯 Little colour chip shown next to each theme name
const SWATCHES: Record<Palette, string> = {
  aqua: 'linear-gradient(135deg, #e8f4ff 0%, #6fa8f0 55%, #0a4ab0 100%)',
  classic: 'linear-gradient(135deg, #f6f1f6 0%, #a77fa7 55%, #5f9e6c 100%)',
}

const PaletteToggler = ({ className = '' }: { className?: string }) => {
  const t = useTranslations('ThemePicker')
  const { palette, setPalette } = usePalette()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          title={t('label')}
          aria-label={`${t('label')} : ${t(palette)}`}
          className={className + ' rounded-full'}
        >
          <PaletteIcon className="h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={palette} onValueChange={(value) => setPalette(value as Palette)}>
          {PALETTES.map((name) => (
            <DropdownMenuRadioItem key={name} value={name} className="gap-2">
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10"
                style={{ background: SWATCHES[name] }}
              />
              {t(name)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PaletteToggler
