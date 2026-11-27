'use client'
import { useEffect } from 'react'

// 🔊 Soft XMB-like "tick" when hovering navigation links. Synthesised with Web Audio,
// so no asset is needed. Browsers only allow audio after a first click/tap.
export default function AquaNavSound() {
  useEffect(() => {
    let ctx: AudioContext | null = null
    let lastTarget: Element | null = null

    const unlock = () => {
      if (!ctx) ctx = new AudioContext()
      if (ctx.state === 'suspended') ctx.resume()
    }

    const tick = () => {
      if (!ctx || ctx.state !== 'running') return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(2200, now)
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.08)
    }

    const onPointerOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest('nav a, nav button')
      if (!target || target === lastTarget) return
      lastTarget = target
      tick()
    }

    const onPointerOut = (e: PointerEvent) => {
      const related = (e.relatedTarget as Element | null)?.closest('nav a, nav button')
      if (!related) lastTarget = null
    }

    window.addEventListener('pointerdown', unlock)
    window.addEventListener('pointerover', onPointerOver)
    window.addEventListener('pointerout', onPointerOut)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
      ctx?.close()
    }
  }, [])

  return null
}
