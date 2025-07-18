"use client"
import { Noise } from 'noisejs'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { CloudRainWind } from 'lucide-react'

const DitheredPerlinBackground = ({ className = '' }) => {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const animationFrameRef = useRef()
  const timerRef = useRef()
  const noiseRef = useRef(null)
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
    // 🎯 Initialize noise only once when component mounts
    if (!noiseRef.current) {
      noiseRef.current = new Noise(Math.random())
    }
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
    if (!canvas || !noiseRef.current || !isMounted) return

    const ctx = canvas.getContext('2d')
    const { width, height } = dimensions
    canvas.width = width
    canvas.height = height

    let w = canvas.width
    let h = canvas.height

    // 🎯 Noise parameters
    let nt = 0
    let noiseSpeed = 0.002
    let noiseScale = 400
    let pixelSize = 1

    // 🎯 Performance optimizations
    const canvasScale = 0.5 // Render at half resolution, scale up
    const actualWidth = Math.floor(w * canvasScale)
    const actualHeight = Math.floor(h * canvasScale)

    // 🎯 Dithering parameters
    const ditherMatrix = [
      [  0,  8,  2, 10 ],
      [ 12,  4, 14,  6 ],
      [  3, 11,  1,  9 ],
      [ 15,  7, 13,  5 ]
    ]
    const matrixSize = 4

    // 🎯 Convert theme colors to RGB
    const backgroundRgb = hslToRgb(themeColors.background.h, themeColors.background.s, themeColors.background.l)
    const primaryRgb = hslToRgb(themeColors.primary.h, themeColors.primary.s, themeColors.primary.l)
    
    const noise = noiseRef.current

    function drawDitheredPerlinGradient() {
      const imageData = ctx.createImageData(actualWidth, actualHeight)
      const data = imageData.data

      for (let y = 0; y < actualHeight; y += pixelSize) {
        for (let x = 0; x < actualWidth; x += pixelSize) {
          // 🎯 Get base gradient position (right to left)
          const baseGradientPos = 1 - (x / actualWidth)

          // 🎯 Add Perlin noise variation to create organic distortion
          const noiseValue = noise.perlin3(x / (noiseScale * canvasScale), y / (noiseScale * canvasScale), nt)
          
          // 🎯 Shift gradient to make background color more present
          const shiftedGradientPos = baseGradientPos * 0.3 + (noiseValue * 0.1)
          const gradientPos = Math.max(0, Math.min(1, shiftedGradientPos))

          // 🎯 Get dither threshold from matrix (normalized to 0-1)
          const ditherThreshold = ditherMatrix[(y / pixelSize) % matrixSize][(x / pixelSize) % matrixSize] / 15

          // 🎯 Determine which color to use based on gradient position vs dither threshold
          const usePrimary = gradientPos > ditherThreshold
          
          const finalR = usePrimary ? primaryRgb.r : backgroundRgb.r
          const finalG = usePrimary ? primaryRgb.g : backgroundRgb.g
          const finalB = usePrimary ? primaryRgb.b : backgroundRgb.b

          // 🎯 Fill pixel block
          for (let dy = 0; dy < pixelSize && y + dy < actualHeight; dy++) {
            for (let dx = 0; dx < pixelSize && x + dx < actualWidth; dx++) {
              const pixelIndex = ((y + dy) * actualWidth + (x + dx)) * 4
              data[pixelIndex] = finalR
              data[pixelIndex + 1] = finalG
              data[pixelIndex + 2] = finalB
              data[pixelIndex + 3] = 255
            }
          }
        }
      }

      // 🎯 Scale up the smaller canvas
      ctx.putImageData(imageData, 0, 0)
      ctx.drawImage(canvas, 0, 0, actualWidth, actualHeight, 0, 0, w, h)
    }

    function render() {
      nt += noiseSpeed
      drawDitheredPerlinGradient()
      timerRef.current = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(render)
      }, 50) // Slower refresh rate for better performance
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

export default DitheredPerlinBackground 