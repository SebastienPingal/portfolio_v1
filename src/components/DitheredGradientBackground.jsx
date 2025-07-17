"use client"
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const DitheredGradientBackground = ({ className = '' }) => {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const animationFrameRef = useRef()
  const timerRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [themeColors, setThemeColors] = useState({
    background: { h: 0, s: 0, l: 0 },
    primary: { h: 0, s: 0, l: 0 }
  })

  // 🎯 Helper function to parse HSL from CSS variable
  const parseHSL = (hslString) => {
    const values = hslString.split(' ').map(v => parseFloat(v))
    return { h: values[0], s: values[1], l: values[2] }
  }

  // 🎯 Helper function to convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = n => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
    }
    return { r: f(0), g: f(8), b: f(4) }
  }

  // 🎯 Update theme colors when theme changes
  useEffect(() => {
    if (!isMounted) return

    const getThemeColors = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const backgroundHSL = computedStyle.getPropertyValue('--background').trim()
      const primaryHSL = computedStyle.getPropertyValue('--primary').trim()
      
      setThemeColors({
        background: parseHSL(backgroundHSL),
        primary: parseHSL(primaryHSL)
      })
    }

    getThemeColors()
    // 🎯 Update colors when theme changes
    const observer = new MutationObserver(getThemeColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [theme, isMounted])

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    if (!canvas || !isMounted) return

    const ctx = canvas.getContext('2d')
    const { width, height } = dimensions
    canvas.width = width
    canvas.height = height

    let w = canvas.width
    let h = canvas.height

    // 🎯 Dithering parameters
    const pixelSize = 1
    // Using a 6x6 Bayer matrix for finer dithering granularity
    const ditherMatrix = [
      [  0, 32,  8, 40,  2, 34 ],
      [ 48, 16, 56, 24, 50, 18 ],
      [ 12, 44,  4, 36, 14, 46 ],
      [ 60, 28, 52, 20, 62, 30 ],
      [  3, 35, 11, 43,  1, 33 ],
      [ 51, 19, 59, 27, 49, 17 ]
    ]
    const matrixSize = 6 // ✅ Update this to match your matrix dimensions

    // 🎯 Convert theme colors to RGB
    const backgroundRgb = hslToRgb(themeColors.background.h, themeColors.background.s, themeColors.background.l)
    const primaryRgb = hslToRgb(themeColors.primary.h, themeColors.primary.s, themeColors.primary.l)

    function drawDitheredGradient() {
      const imageData = ctx.createImageData(w, h)
      const data = imageData.data

      for (let y = 0; y < h; y += pixelSize) {
        for (let x = 0; x < w; x += pixelSize) {
          // 🎯 Calculate gradient position from left to right (0 to 1)
          const gradientPos = x / w

          // 🎯 Get dither threshold from matrix (normalized to 0-1)
          const ditherThreshold = ditherMatrix[(y / pixelSize) % matrixSize][(x / pixelSize) % matrixSize] / 36 // ✅ Update this divisor

          // 🎯 Determine which color to use based on gradient position vs dither threshold
          const usePrimary = gradientPos > ditherThreshold
          
          const finalR = usePrimary ? primaryRgb.r : backgroundRgb.r
          const finalG = usePrimary ? primaryRgb.g : backgroundRgb.g
          const finalB = usePrimary ? primaryRgb.b : backgroundRgb.b

          // 🎯 Fill pixel block
          for (let dy = 0; dy < pixelSize && y + dy < h; dy++) {
            for (let dx = 0; dx < pixelSize && x + dx < w; dx++) {
              const pixelIndex = ((y + dy) * w + (x + dx)) * 4
              data[pixelIndex] = finalR
              data[pixelIndex + 1] = finalG
              data[pixelIndex + 2] = finalB
              data[pixelIndex + 3] = 255
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    function render() {
      drawDitheredGradient()
      timerRef.current = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(render)
      }, 1000) // Slower refresh since it's static
    }

    // Start the rendering
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

  }, [theme, dimensions, isMounted, themeColors])

  return <canvas ref={canvasRef} className={`h-full w-full z-0 overflow-hidden fixed ${className}`} />
}

export default DitheredGradientBackground 