'use client'
import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"
import { useEffect, useState } from "react"
import { usePalette, type Palette } from "./PaletteProvider"

const LABELS: Record<Palette, string> = {
  'default': 'Palette par défaut',
  'ps': 'Palette PlayStation — fond vagues',
  'ps-perlin': 'Palette PlayStation — fond Perlin',
}

const PaletteToggler = ({ className = '' }: { className?: string }) => {
  const { palette, cyclePalette } = usePalette()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const next = palette === 'default' ? 'ps' : palette === 'ps' ? 'ps-perlin' : 'default'

  return (
    <Button
      onClick={cyclePalette}
      variant='ghost'
      size='icon'
      title={`${LABELS[palette]} (suivant : ${LABELS[next]})`}
      aria-label={`Changer de palette, actuelle : ${LABELS[palette]}`}
      className={className + ' rounded-full relative'}
    >
      <Gamepad2 className={'h-6 ' + (palette === 'default' ? 'opacity-60' : 'text-primary')} />
      {palette === 'ps-perlin' && (
        <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </Button>
  )
}

export default PaletteToggler
