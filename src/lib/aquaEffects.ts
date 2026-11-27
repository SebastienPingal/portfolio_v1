// 🫧 Optional Frutiger Aero upgrades for the Aqua palette, each one toggleable from
// the hidden effects panel (Alt+Shift+A, or ?fx in the URL).
// Active effects are mirrored on <html data-aqua-fx="id id ..."> so CSS can key on
// [data-aqua-fx~="id"]; background effects are read by AquaBackground.

export const AQUA_EFFECTS = [
  { id: 'gel', group: 'Interface', label: 'Boutons gel', hint: 'Dégradé coupé au milieu + reflet' },
  { id: 'cards', group: 'Interface', label: 'Cartes brillantes', hint: 'Reflet en haut, ombre, balayage au survol' },
  { id: 'pills', group: 'Interface', label: 'Pastilles gel', hint: 'Badges et menu actif' },
  { id: 'beads', group: 'Interface', label: 'Frise en perles', hint: 'Points de la timeline en billes de verre' },
  { id: 'ribbons', group: 'Fond', label: 'Rubans XMB lumineux', hint: 'Lignes fines qui brillent et s’additionnent' },
  { id: 'bokeh', group: 'Fond', label: 'Bokeh', hint: 'Taches de lumière floues qui dérivent' },
  { id: 'sparkles', group: 'Fond', label: 'Scintillements', hint: 'Petites étincelles qui clignotent' },
  { id: 'rays', group: 'Fond', label: 'Rayons de lumière', hint: 'Faisceaux venant du haut' },
  { id: 'daycycle', group: 'Fond', label: 'Teinte selon l’heure', hint: 'Aube, jour, crépuscule, nuit' },
  { id: 'glowtype', group: 'Typo & détails', label: 'Titres lumineux', hint: 'Lueur blanche + police arrondie' },
  { id: 'orb', group: 'Typo & détails', label: 'Avatar orbe', hint: 'Reflet de verre sur la photo' },
  { id: 'lime', group: 'Typo & détails', label: 'Accent vert lime', hint: 'Le duo bleu + vert du style' },
  { id: 'scrollbar', group: 'Typo & détails', label: 'Barre de défilement Aqua', hint: 'Poignée en gel bleu' },
  { id: 'pop', group: 'Gadgets', label: 'Bulle au clic', hint: 'Une bulle éclate où on clique' },
  { id: 'sound', group: 'Gadgets', label: 'Son XMB', hint: '« Tic » au survol de la navigation' },
] as const

export type AquaEffectId = (typeof AQUA_EFFECTS)[number]['id']

export const AQUA_EFFECT_IDS = AQUA_EFFECTS.map((e) => e.id) as AquaEffectId[]

// v2: sparkles and bokeh were split, so earlier stored choices are reset to the defaults
export const AQUA_FX_STORAGE_KEY = 'aqua-fx-v2'

// 🎯 What a visitor gets before touching the panel
export const DEFAULT_AQUA_EFFECTS: AquaEffectId[] = ['gel', 'pills', 'ribbons', 'bokeh', 'daycycle', 'orb']
export const DEFAULT_AQUA_FX_ATTR = DEFAULT_AQUA_EFFECTS.join(' ')

export const parseAquaEffects = (raw: string | null): AquaEffectId[] =>
  (raw ?? '').split(/\s+/).filter((id): id is AquaEffectId => (AQUA_EFFECT_IDS as string[]).includes(id))

// 🎯 Inline script run before paint so stored choices replace the defaults without a flash
// (null = never touched, keep defaults; "" = everything switched off)
export const aquaEffectsInitScript = `(function(){try{var v=localStorage.getItem('${AQUA_FX_STORAGE_KEY}');if(v===null)return;if(v)document.documentElement.setAttribute('data-aqua-fx',v);else document.documentElement.removeAttribute('data-aqua-fx')}catch(e){}})()`
