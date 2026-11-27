'use client'
import { useEffect } from 'react'

// 🫧 Spawns a soap bubble that pops where the user clicks (styles in globals.css)
export default function AquaClickBubbles() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onPointerDown = (e: PointerEvent) => {
      const bubble = document.createElement('span')
      bubble.className = 'aqua-pop'
      bubble.setAttribute('aria-hidden', 'true')
      bubble.style.left = `${e.clientX}px`
      bubble.style.top = `${e.clientY}px`

      // 🎯 A few droplets flying out when it pops
      for (let i = 0; i < 6; i++) {
        const drop = document.createElement('span')
        const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5
        const distance = 18 + Math.random() * 14
        drop.className = 'aqua-pop-drop'
        drop.style.setProperty('--dx', `${Math.cos(angle) * distance}px`)
        drop.style.setProperty('--dy', `${Math.sin(angle) * distance}px`)
        bubble.appendChild(drop)
      }

      document.body.appendChild(bubble)
      window.setTimeout(() => bubble.remove(), 700)
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return null
}
