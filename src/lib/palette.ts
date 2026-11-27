// 🎨 Colour palettes layered on top of light/dark (next-themes keeps owning that axis).
// The active palette is mirrored on <html data-palette="...">, which globals.css keys on.
// Kept out of the 'use client' provider so the server layout can import real values.

export const PALETTES = ['aqua', 'classic'] as const
export type Palette = (typeof PALETTES)[number]

export const DEFAULT_PALETTE: Palette = 'aqua'
export const PALETTE_STORAGE_KEY = 'theme-palette'

export const isPalette = (value: unknown): value is Palette =>
  typeof value === 'string' && (PALETTES as readonly string[]).includes(value)

// 🎯 Inline script run before paint so a stored palette doesn't flash the default one
export const paletteInitScript = `(function(){try{var p=localStorage.getItem('${PALETTE_STORAGE_KEY}');if(${JSON.stringify(PALETTES)}.indexOf(p)>-1)document.documentElement.setAttribute('data-palette',p)}catch(e){}})()`
