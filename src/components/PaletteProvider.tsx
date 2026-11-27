'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// 🎯 Colour palettes layered on top of light/dark (next-themes keeps owning that axis).
// "ps" and "ps-perlin" share the PlayStation colours and only differ by background,
// so both background variants can be compared while the look is being tested.
export const PALETTES = ['default', 'ps', 'ps-perlin'] as const
export type Palette = (typeof PALETTES)[number]

export const PALETTE_STORAGE_KEY = 'palette'

const isPalette = (value: unknown): value is Palette =>
  typeof value === 'string' && (PALETTES as readonly string[]).includes(value)

const applyPalette = (palette: Palette) => {
  const root = document.documentElement
  if (palette === 'default') root.removeAttribute('data-palette')
  else root.setAttribute('data-palette', palette)
}

type PaletteContextValue = {
  palette: Palette
  setPalette: (palette: Palette) => void
  cyclePalette: () => void
}

const PaletteContext = createContext<PaletteContextValue>({
  palette: 'default',
  setPalette: () => {},
  cyclePalette: () => {},
})

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>('default')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PALETTE_STORAGE_KEY)
      if (isPalette(stored)) setPaletteState(stored)
    } catch {}
  }, [])

  useEffect(() => {
    applyPalette(palette)
  }, [palette])

  const setPalette = useCallback((next: Palette) => {
    setPaletteState(next)
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, next)
    } catch {}
  }, [])

  const cyclePalette = useCallback(() => {
    setPalette(PALETTES[(PALETTES.indexOf(palette) + 1) % PALETTES.length])
  }, [palette, setPalette])

  return (
    <PaletteContext.Provider value={{ palette, setPalette, cyclePalette }}>
      {children}
    </PaletteContext.Provider>
  )
}

export const usePalette = () => useContext(PaletteContext)

// 🎯 Inline script run before paint so a stored palette doesn't flash the default colours
export const paletteInitScript = `(function(){try{var p=localStorage.getItem('${PALETTE_STORAGE_KEY}');if(p==='ps'||p==='ps-perlin')document.documentElement.setAttribute('data-palette',p)}catch(e){}})()`
