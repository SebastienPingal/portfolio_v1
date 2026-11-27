'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { DEFAULT_PALETTE, PALETTE_STORAGE_KEY, isPalette, type Palette } from '@/lib/palette'

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
