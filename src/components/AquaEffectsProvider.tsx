'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  AQUA_EFFECT_IDS,
  AQUA_FX_STORAGE_KEY,
  DEFAULT_AQUA_EFFECTS,
  parseAquaEffects,
  type AquaEffectId,
} from '@/lib/aquaEffects'
import { usePalette } from './PaletteProvider'
import AquaEffectsPanel from './AquaEffectsPanel'
import AquaClickBubbles from './AquaClickBubbles'
import AquaNavSound from './AquaNavSound'

type AquaEffectsContextValue = {
  effects: Set<AquaEffectId>
  /** True when the effect is switched on AND the Aqua palette is active */
  isOn: (id: AquaEffectId) => boolean
  toggle: (id: AquaEffectId) => void
  setAll: (on: boolean) => void
  resetDefaults: () => void
}

const AquaEffectsContext = createContext<AquaEffectsContextValue>({
  effects: new Set(),
  isOn: () => false,
  toggle: () => {},
  setAll: () => {},
  resetDefaults: () => {},
})

export function AquaEffectsProvider({ children }: { children: React.ReactNode }) {
  const { palette } = usePalette()
  const [effects, setEffects] = useState<Set<AquaEffectId>>(() => new Set(DEFAULT_AQUA_EFFECTS))
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AQUA_FX_STORAGE_KEY)
      if (stored !== null) setEffects(new Set(parseAquaEffects(stored)))
    } catch {}
    if (new URLSearchParams(window.location.search).has('fx')) setPanelOpen(true)
  }, [])

  useEffect(() => {
    const value = AQUA_EFFECT_IDS.filter((id) => effects.has(id)).join(' ')
    if (value) document.documentElement.setAttribute('data-aqua-fx', value)
    else document.documentElement.removeAttribute('data-aqua-fx')
  }, [effects])

  // 🎯 Hidden shortcut: Alt+Shift+A toggles the panel
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault()
        setPanelOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const persist = (next: Set<AquaEffectId>) => {
    try {
      localStorage.setItem(AQUA_FX_STORAGE_KEY, Array.from(next).join(' '))
    } catch {}
    return next
  }

  const toggle = useCallback((id: AquaEffectId) => {
    setEffects((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return persist(next)
    })
  }, [])

  const setAll = useCallback((on: boolean) => {
    setEffects(persist(new Set(on ? AQUA_EFFECT_IDS : [])))
  }, [])

  const resetDefaults = useCallback(() => {
    try {
      localStorage.removeItem(AQUA_FX_STORAGE_KEY)
    } catch {}
    setEffects(new Set(DEFAULT_AQUA_EFFECTS))
  }, [])

  const value = useMemo<AquaEffectsContextValue>(() => ({
    effects,
    isOn: (id) => palette === 'aqua' && effects.has(id),
    toggle,
    setAll,
    resetDefaults,
  }), [effects, palette, toggle, setAll, resetDefaults])

  return (
    <AquaEffectsContext.Provider value={value}>
      {children}
      {value.isOn('pop') && <AquaClickBubbles />}
      {value.isOn('sound') && <AquaNavSound />}
      {panelOpen && <AquaEffectsPanel onClose={() => setPanelOpen(false)} />}
    </AquaEffectsContext.Provider>
  )
}

export const useAquaEffects = () => useContext(AquaEffectsContext)
