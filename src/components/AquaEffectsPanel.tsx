'use client'
import { X } from 'lucide-react'
import { AQUA_EFFECTS } from '@/lib/aquaEffects'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useAquaEffects } from './AquaEffectsProvider'
import { usePalette } from './PaletteProvider'

// 🎯 Hidden test panel (Alt+Shift+A or ?fx) to switch each Aqua upgrade on and off
const GROUPS = Array.from(new Set(AQUA_EFFECTS.map((e) => e.group)))

export default function AquaEffectsPanel({ onClose }: { onClose: () => void }) {
  const { effects, toggle, setAll, resetDefaults } = useAquaEffects()
  const { palette, setPalette } = usePalette()

  return (
    <div
      role="dialog"
      aria-label="Effets Aqua"
      className="fixed z-50 bottom-4 right-4 w-[min(20rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border bg-popover/90 text-popover-foreground backdrop-blur-xl shadow-2xl p-4 flex flex-col gap-3 text-sm"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-base">🫧 Effets Aqua</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onClose} aria-label="Fermer">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {palette !== 'aqua' && (
        <div className="rounded-md bg-muted p-2 flex items-center justify-between gap-2">
          <span className="opacity-80">Visibles seulement avec le thème Aqua.</span>
          <Button variant="ghost" className="h-7 px-2 underline" onClick={() => setPalette('aqua')}>Activer</Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" className="h-7 px-2 flex-1 border" onClick={resetDefaults}>Par défaut</Button>
        <Button variant="ghost" className="h-7 px-2 flex-1 border" onClick={() => setAll(true)}>Tout</Button>
        <Button variant="ghost" className="h-7 px-2 flex-1 border" onClick={() => setAll(false)}>Rien</Button>
      </div>

      {GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide opacity-60">{group}</span>
          {AQUA_EFFECTS.filter((e) => e.group === group).map((effect) => (
            <label key={effect.id} className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="flex flex-col leading-tight">
                <span className="font-medium">{effect.label}</span>
                <span className="text-xs opacity-60">{effect.hint}</span>
              </span>
              <Switch checked={effects.has(effect.id)} onCheckedChange={() => toggle(effect.id)} />
            </label>
          ))}
        </div>
      ))}

      <span className="text-xs opacity-50 text-center">Alt+Shift+A pour ouvrir / fermer</span>
    </div>
  )
}
