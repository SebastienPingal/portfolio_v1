"use client"
import { Noise } from 'noisejs'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const PerlinBackground = ({ className = '' }) => {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const animationFrameRef = useRef()
  const timerRef = useRef()
  const noiseRef = useRef(null) // 🎯 Persist noise instance
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // 🎯 Initialize noise only once when component mounts
    if (!noiseRef.current) {
      noiseRef.current = new Noise(Math.random())
    }
  }, [])

  const isBlackTheme = isMounted && theme === 'dark'

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !noiseRef.current) return // 🎯 Wait for noise to be initialized

    const ctx = canvas.getContext('2d')
    const { width, height } = dimensions
    canvas.width = width
    canvas.height = height

    let w = canvas.width
    let h = canvas.height

    let nt = 0
    let noiseSpeed = 0.009
    let noiseScale = 300
    let dotSize = 16
    let gap = 0
    let shape = 0
    let noise = noiseRef.current // 🎯 Use the persistent noise instance

    function draw() {
      nt += noiseSpeed
      for (var x = 0; x < w; x += dotSize + gap) {
        for (var y = 0; y < h; y += dotSize + gap) {
          var yn = noise.perlin3(y / noiseScale, x / noiseScale, nt) * 20

          ctx.beginPath()
          ctx.fillStyle = isBlackTheme
            ? `rgba(${Math.max(yn * 10 + 30, 40)}, ${Math.max(yn * 12 + 30, 45)}, ${Math.max(yn * 10 + 30, 40)}, 1)`
            : `rgba(${255 - yn * 10}, ${Math.min(230 - yn * 10, 235)}, ${255 - yn * 10}, 1)`
          if (shape == 0) {
            ctx.fillRect(x, y, dotSize, dotSize)
          } else if (shape == 1) {
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (shape == 2) {
            ctx.moveTo(x + (dotSize / 2), y + dotSize)
            ctx.lineTo(x, y)
            ctx.lineTo(x + dotSize, y)
            ctx.fill()
          } else if (shape == 3) {
            if (y % ((gap + dotSize) * 2) == (gap + dotSize)) {
              ctx.moveTo(x + (dotSize / 2), y)
              ctx.lineTo(x + dotSize, y + dotSize)
              ctx.lineTo(x, y + dotSize)
            } else {
              ctx.moveTo(x + (dotSize / 2), y + dotSize)
              ctx.lineTo(x, y)
              ctx.lineTo(x + dotSize, y)
            }
            ctx.fill()
          }
          ctx.closePath()
        }
      }
    }

    function clear() {
      ctx.fillStyle = "rgba(0,0,4,1)"
      ctx.fillRect(0, 0, w, h)
    }

    function render() {
      clear()
      draw()
      timerRef.current = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(render)
      }, 80) // Delay in milliseconds
    }

    // Start the animation
    render()

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }

  }, [theme, dimensions, isBlackTheme])

  // if (!isMounted) return null
  return <canvas ref={canvasRef} className={`h-full w-full z-0 overflow-hidden fixed ${className}`} />
}

export default PerlinBackground