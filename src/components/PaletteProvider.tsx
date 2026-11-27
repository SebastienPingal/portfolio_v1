'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// 🎯 Colour palettes layered on top of light/dark (next-themes keeps owning that axis).
// The active palette is mirrored on <html data-palette="...">, which globals.css keys on.
export const PALETTES = ['aqua', 'classic'] as const
export type Palette = (typeof PALETTES)[number]

export const DEFAULT_PALETTE: Palette = 'aqua'
export const PALETTE_STORAGE_KEY = 'theme-palette'

const isPalette = (value: unknown): value is Palette =>
  typeof value === 'string' && (PALETTES as readonly string[]).includes(value)

type PaletteContextValue = {
  palette: Palette
  setPalette: (palette: Palette) => void
}

const PaletteContext = createContext<PaletteContextValue>({
  palette: DEFAULT_PALETTE,
  setPalette: () => {},
})

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>(DEFAULT_PALETTE)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PALETTE_STORAGE_KEY)
      if (isPalette(stored)) setPaletteState(stored)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette)
  }, [palette])

  const setPalette = useCallback((next: Palette) => {
    setPaletteState(next)
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, next)
    } catch {}
  }, [])

  return (
    <PaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </PaletteContext.Provider>
  )
}

export const usePalette = () => useContext(PaletteContext)

// 🎯 Inline script run before paint so a stored palette doesn't flash the default one
export const paletteInitScript = `(function(){try{var p=localStorage.getItem('${PALETTE_STORAGE_KEY}');if(${JSON.stringify(PALETTES)}.indexOf(p)>-1)document.documentElement.setAttribute('data-palette',p)}catch(e){}})()`
