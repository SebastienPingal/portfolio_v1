"use client"
import { useEffect, useRef } from 'react'

// 🎯 Aqua background: blue gradient, XMB-style wave ribbons and floating soap bubbles.
// Optional layers (toggled from the Aqua effects panel):
//   ribbons  – thin luminous XMB lines whose glow adds up where they cross
//   sparkles – twinkling sparkles + soft out-of-focus bokeh discs
//   rays     – light shafts coming from the top, like light under water
//   daycycle – tint that follows the visitor's local time (dawn, day, dusk, night)

const PALETTES = {
  light: {
    gradient: ['#e8f4ff', '#b9dcff', '#6fa8f0'],
    waves: ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.35)', 'rgba(120,190,255,0.35)'],
    waveEdge: 'rgba(255,255,255,0.9)',
    bubbleRim: 'rgba(255,255,255,0.85)',
    bubbleTint: 'rgba(90,160,240,0.18)',
    highlight: 'rgba(255,255,255,0.95)',
    blend: 'screen',
    ribbon: [255, 255, 255],
    sparkle: [255, 255, 255],
    bokeh: [255, 255, 255],
    ray: [255, 255, 255],
    rayAlpha: 0.22,
    tintStrength: 1,
  },
  dark: {
    gradient: ['#010a24', '#03215e', '#0a4ab0'],
    waves: ['rgba(80,170,255,0.22)', 'rgba(140,210,255,0.16)', 'rgba(40,110,230,0.22)'],
    waveEdge: 'rgba(170,225,255,0.7)',
    bubbleRim: 'rgba(150,215,255,0.75)',
    bubbleTint: 'rgba(60,140,255,0.12)',
    highlight: 'rgba(220,245,255,0.9)',
    blend: 'lighter',
    ribbon: [140, 210, 255],
    sparkle: [200, 235, 255],
    bokeh: [90, 170, 255],
    ray: [120, 190, 255],
    rayAlpha: 0.1,
    tintStrength: 0.6,
  },
}

const WAVES = [
  { y: 0.62, amp: 0.07, freq: 1.4, speed: 0.00018, thickness: 0.10, phase: 0 },
  { y: 0.66, amp: 0.05, freq: 2.1, speed: -0.00026, thickness: 0.06, phase: 1.7 },
  { y: 0.70, amp: 0.09, freq: 0.9, speed: 0.00012, thickness: 0.14, phase: 3.1 },
]

// 🎯 XMB ribbon: a bundle of thin lines sharing a base curve with small offsets
const RIBBON_LINES = [
  { y: 0.58, amp: 0.08, freq: 0.8, speed: 0.00016, phase: 0.0 },
  { y: 0.59, amp: 0.07, freq: 0.9, speed: 0.00019, phase: 0.4 },
  { y: 0.60, amp: 0.09, freq: 0.75, speed: 0.00014, phase: 0.9 },
  { y: 0.61, amp: 0.06, freq: 1.1, speed: 0.00022, phase: 1.5 },
  { y: 0.63, amp: 0.08, freq: 0.85, speed: -0.00012, phase: 2.2 },
  { y: 0.64, amp: 0.05, freq: 1.3, speed: -0.00017, phase: 2.9 },
  { y: 0.66, amp: 0.07, freq: 0.7, speed: 0.0001, phase: 3.6 },
  { y: 0.68, amp: 0.06, freq: 1.0, speed: -0.00015, phase: 4.4 },
]

// 🎯 Sky tint keyframes by local hour: [hour, r, g, b, alpha]
const DAY_TINTS = [
  [0, 8, 18, 70, 0.38],
  [5, 8, 18, 70, 0.38],
  [6.5, 255, 160, 190, 0.26],
  [9, 255, 255, 255, 0],
  [16.5, 255, 255, 255, 0],
  [18.5, 255, 130, 70, 0.28],
  [20.5, 8, 18, 70, 0.38],
  [24, 8, 18, 70, 0.38],
]

const rand = (min, max) => min + Math.random() * (max - min)
const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`

const tintForNow = () => {
  const d = new Date()
  const hour = d.getHours() + d.getMinutes() / 60
  const i = DAY_TINTS.findIndex(([h]) => h > hour)
  const [h0, ...a] = DAY_TINTS[Math.max(0, i - 1)]
  const [h1, ...b] = DAY_TINTS[Math.max(1, i)]
  const k = h1 === h0 ? 0 : (hour - h0) / (h1 - h0)
  const [r, g, bl, alpha] = a.map((v, j) => v + (b[j] - v) * k)
  return { rgb: [Math.round(r), Math.round(g), Math.round(bl)], alpha }
}

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

const createSparkle = (w, h) => ({
  x: rand(0, w),
  y: h * rand(0.4, 0.85),
  r: rand(0.8, 2.4),
  drift: rand(0.004, 0.018),
  twinkle: rand(0.001, 0.004),
  phase: rand(0, Math.PI * 2),
})

const createBokeh = (w, h) => ({
  x: rand(0, w),
  y: rand(0, h),
  r: rand(30, 110),
  alpha: rand(0.06, 0.14),
  vx: rand(-0.006, 0.006),
  vy: rand(-0.004, 0.004),
})

const RAYS = [
  { x: 0.12, width: 0.06, lean: 0.18, phase: 0 },
  { x: 0.3, width: 0.1, lean: 0.2, phase: 1.3 },
  { x: 0.52, width: 0.05, lean: 0.22, phase: 2.1 },
  { x: 0.68, width: 0.09, lean: 0.19, phase: 3.4 },
  { x: 0.88, width: 0.06, lean: 0.21, phase: 4.6 },
]

const AquaBackground = ({ className = '', ribbons = false, sparkles = false, rays = false, daycycle = false }) => {
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
    let sparkleList = []
    let bokehList = []
    let colors = PALETTES.light
    let tint = tintForNow()
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
      sparkleList = Array.from({ length: Math.round(Math.min(70, w / 22)) }, () => createSparkle(w, h))
      bokehList = Array.from({ length: 8 }, () => createBokeh(w, h))
    }

    const drawGradient = () => {
      const g = ctx.createLinearGradient(0, 0, w * 0.3, h)
      g.addColorStop(0, colors.gradient[0])
      g.addColorStop(0.55, colors.gradient[1])
      g.addColorStop(1, colors.gradient[2])
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    const drawDayTint = () => {
      const alpha = tint.alpha * colors.tintStrength
      if (alpha <= 0.005) return
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, rgba(tint.rgb, alpha))
      g.addColorStop(1, rgba(tint.rgb, alpha * 0.35))
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    const drawRays = (t) => {
      ctx.save()
      ctx.globalCompositeOperation = colors.blend
      RAYS.forEach((ray) => {
        const sway = Math.sin(t * 0.00012 + ray.phase) * 0.04
        const top = ray.x * w
        const half = (ray.width * w) / 2
        const lean = (ray.lean + sway) * h
        const spread = half * 2.2
        const g = ctx.createLinearGradient(0, 0, 0, h * 0.85)
        g.addColorStop(0, rgba(colors.ray, colors.rayAlpha))
        g.addColorStop(1, rgba(colors.ray, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(top - half, 0)
        ctx.lineTo(top + half, 0)
        ctx.lineTo(top + lean + spread, h * 0.85)
        ctx.lineTo(top + lean - spread, h * 0.85)
        ctx.closePath()
        ctx.fill()
      })
      ctx.restore()
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

    // 🎯 Each line is stroked three times (wide haze, glow, crisp core) with additive
    // blending, so overlapping lines get brighter like on the PS3 XMB
    const drawRibbons = (t) => {
      ctx.save()
      ctx.globalCompositeOperation = colors.blend
      ctx.lineCap = 'round'
      const step = Math.max(6, w / 160)
      const passes = [
        { width: 26, alpha: 0.035 },
        { width: 7, alpha: 0.1 },
        { width: 1.3, alpha: 0.75 },
      ]
      RIBBON_LINES.forEach((line) => {
        const path = new Path2D()
        for (let x = 0; x <= w + step; x += step) {
          const y = waveY(line, x, t)
          x === 0 ? path.moveTo(x, y) : path.lineTo(x, y)
        }
        passes.forEach(({ width, alpha }) => {
          ctx.strokeStyle = rgba(colors.ribbon, alpha)
          ctx.lineWidth = width
          ctx.stroke(path)
        })
      })
      ctx.restore()
    }

    const drawBokeh = (dt) => {
      ctx.save()
      ctx.globalCompositeOperation = colors.blend
      bokehList.forEach((b) => {
        if (!reduceMotion) {
          b.x += b.vx * dt
          b.y += b.vy * dt
          if (b.x < -b.r) b.x = w + b.r
          if (b.x > w + b.r) b.x = -b.r
          if (b.y < -b.r) b.y = h + b.r
          if (b.y > h + b.r) b.y = -b.r
        }
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, rgba(colors.bokeh, b.alpha * 0.7))
        g.addColorStop(0.85, rgba(colors.bokeh, b.alpha))
        g.addColorStop(1, rgba(colors.bokeh, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
    }

    const drawSparkles = (t, dt) => {
      ctx.save()
      ctx.globalCompositeOperation = colors.blend
      sparkleList.forEach((s) => {
        if (!reduceMotion) {
          s.x += s.drift * dt
          if (s.x > w + 10) s.x = -10
        }
        const tw = Math.pow(0.5 + 0.5 * Math.sin(t * s.twinkle + s.phase), 3)
        if (tw < 0.02) return
        const r = s.r * 4
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r)
        g.addColorStop(0, rgba(colors.sparkle, tw))
        g.addColorStop(0.25, rgba(colors.sparkle, tw * 0.4))
        g.addColorStop(1, rgba(colors.sparkle, 0))
        ctx.fillStyle = g
        ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2)

        // 🎯 Cross flare on the bigger ones
        if (s.r > 1.8) {
          ctx.strokeStyle = rgba(colors.sparkle, tw * 0.6)
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(s.x - r * 1.6, s.y)
          ctx.lineTo(s.x + r * 1.6, s.y)
          ctx.moveTo(s.x, s.y - r * 1.6)
          ctx.lineTo(s.x, s.y + r * 1.6)
          ctx.stroke()
        }
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

      drawGradient()
      if (daycycle) drawDayTint()
      if (rays) drawRays(now)
      drawWaves(now)
      if (ribbons) drawRibbons(now)
      if (sparkles) drawBokeh(dt)

      bubbles.forEach((b, i) => {
        if (!reduceMotion) b.y -= b.speed * dt * 0.06
        if (b.y < -b.r * 2) bubbles[i] = createBubble(w, h, false)
        drawBubble(b, now)
      })

      if (sparkles) drawSparkles(now, dt)

      if (!reduceMotion) frame = requestAnimationFrame(render)
    }

    readTheme()
    resize()
    frame = requestAnimationFrame(render)

    // 🎯 Refresh the time-of-day tint once a minute
    const tintTimer = window.setInterval(() => {
      tint = tintForNow()
      if (reduceMotion) render(performance.now())
    }, 60000)

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
      window.clearInterval(tintTimer)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [ribbons, sparkles, rays, daycycle])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full overflow-hidden fixed pointer-events-none ${className}`}
    />
  )
}

export default AquaBackground
