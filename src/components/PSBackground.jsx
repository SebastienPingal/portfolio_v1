"use client"
import { useEffect, useRef } from 'react'

// 🎯 PlayStation-flavoured background: blue gradient, glowing XMB-style wave ribbons
// and floating soap bubbles. With `bubblesOnly` it draws just the bubbles on a
// transparent canvas so it can sit on top of another background.

const PALETTES = {
  light: {
    gradient: ['#e8f4ff', '#b9dcff', '#6fa8f0'],
    waves: ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.35)', 'rgba(120,190,255,0.35)'],
    waveEdge: 'rgba(255,255,255,0.9)',
    bubbleRim: 'rgba(255,255,255,0.85)',
    bubbleTint: 'rgba(90,160,240,0.18)',
    highlight: 'rgba(255,255,255,0.95)',
    blend: 'screen',
  },
  dark: {
    gradient: ['#010a24', '#03215e', '#0a4ab0'],
    waves: ['rgba(80,170,255,0.22)', 'rgba(140,210,255,0.16)', 'rgba(40,110,230,0.22)'],
    waveEdge: 'rgba(170,225,255,0.7)',
    bubbleRim: 'rgba(150,215,255,0.75)',
    bubbleTint: 'rgba(60,140,255,0.12)',
    highlight: 'rgba(220,245,255,0.9)',
    blend: 'lighter',
  },
}

const WAVES = [
  { y: 0.62, amp: 0.07, freq: 1.4, speed: 0.00018, thickness: 0.10, phase: 0 },
  { y: 0.66, amp: 0.05, freq: 2.1, speed: -0.00026, thickness: 0.06, phase: 1.7 },
  { y: 0.70, amp: 0.09, freq: 0.9, speed: 0.00012, thickness: 0.14, phase: 3.1 },
]

const rand = (min, max) => min + Math.random() * (max - min)

const createBubble = (w, h, anywhere) => {
  const r = rand(4, 46) * (Math.random() < 0.15 ? 1.6 : 1)
  return {
    x: rand(0, w),
    y: anywhere ? rand(0, h) : h + r + rand(0, h * 0.3),
    r,
    speed: rand(0.15, 0.55) * (1 + 18 / r) * 0.4,
    sway: rand(8, 30),
    swaySpeed: rand(0.0004, 0.0012),
    phase: rand(0, Math.PI * 2),
  }
}

const PSBackground = ({ className = '', bubblesOnly = false }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let bubbles = []
    let colors = PALETTES.light
    let frame
    let last = performance.now()

    const readTheme = () => {
      colors = root.classList.contains('dark') ? PALETTES.dark : PALETTES.light
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(45, Math.max(18, (w * h) / 32000)))
      bubbles = Array.from({ length: count }, () => createBubble(w, h, true))
    }

    const drawGradient = () => {
      const g = ctx.createLinearGradient(0, 0, w * 0.3, h)
      g.addColorStop(0, colors.gradient[0])
      g.addColorStop(0.55, colors.gradient[1])
      g.addColorStop(1, colors.gradient[2])
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    const waveY = (wave, x, t) => {
      const k = (x / w) * Math.PI * 2 * wave.freq
      return h * (wave.y
        + wave.amp * Math.sin(k + t * wave.speed + wave.phase)
        + wave.amp * 0.35 * Math.sin(k * 2.3 - t * wave.speed * 1.7))
    }

    const drawWaves = (t) => {
      ctx.save()
      ctx.globalCompositeOperation = colors.blend
      const step = Math.max(8, w / 120)
      WAVES.forEach((wave, i) => {
        const thick = h * wave.thickness
        ctx.beginPath()
        for (let x = 0; x <= w + step; x += step) {
          const y = waveY(wave, x, t)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        for (let x = w + step; x >= 0; x -= step) {
          ctx.lineTo(x, waveY(wave, x, t + 900) + thick)
        }
        ctx.closePath()
        const g = ctx.createLinearGradient(0, h * (wave.y - wave.amp), 0, h * (wave.y + wave.amp) + thick)
        g.addColorStop(0, colors.waves[i])
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.fill()

        // 🎯 Thin bright edge on top of each ribbon
        ctx.beginPath()
        for (let x = 0; x <= w + step; x += step) {
          const y = waveY(wave, x, t)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = colors.waveEdge
        ctx.globalAlpha = 0.35
        ctx.lineWidth = 1.2
        ctx.stroke()
        ctx.globalAlpha = 1
      })
      ctx.restore()
    }

    const drawBubble = (b, t) => {
      const x = b.x + Math.sin(t * b.swaySpeed + b.phase) * b.sway
      const y = b.y
      // 🎯 Fade bubbles in near the bottom and out near the top
      const alpha = Math.max(0, Math.min(1, y / (h * 0.25), (h + b.r - y) / (h * 0.15)))
      if (alpha <= 0) return

      ctx.globalAlpha = alpha
      const body = ctx.createRadialGradient(x, y, b.r * 0.2, x, y, b.r)
      body.addColorStop(0, 'rgba(255,255,255,0)')
      body.addColorStop(0.75, colors.bubbleTint)
      body.addColorStop(0.95, colors.bubbleRim)
      body.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(x, y, b.r, 0, Math.PI * 2)
      ctx.fill()

      // 🎯 Specular highlight, top-left
      const hx = x - b.r * 0.38
      const hy = y - b.r * 0.42
      const hl = ctx.createRadialGradient(hx, hy, 0, hx, hy, b.r * 0.32)
      hl.addColorStop(0, colors.highlight)
      hl.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = hl
      ctx.beginPath()
      ctx.arc(hx, hy, b.r * 0.32, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const render = (now) => {
      const dt = Math.min(64, now - last)
      last = now

      if (bubblesOnly) ctx.clearRect(0, 0, w, h)
      else {
        drawGradient()
        drawWaves(now)
      }

      bubbles.forEach((b, i) => {
        if (!reduceMotion) b.y -= b.speed * dt * 0.06
        if (b.y < -b.r * 2) bubbles[i] = createBubble(w, h, false)
        drawBubble(b, now)
      })

      if (!reduceMotion) frame = requestAnimationFrame(render)
    }

    readTheme()
    resize()
    frame = requestAnimationFrame(render)

    const observer = new MutationObserver(() => {
      readTheme()
      if (reduceMotion) render(performance.now())
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    const onResize = () => {
      resize()
      if (reduceMotion) render(performance.now())
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [bubblesOnly])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full overflow-hidden fixed pointer-events-none ${className}`}
    />
  )
}

export default PSBackground
