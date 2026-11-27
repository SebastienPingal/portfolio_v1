"use client"
import { useState, useEffect } from 'react'
import PerlinBackground from './perlinBackground.jsx'
import DitheredPerlinBackground from './DitheredPerlinBackground.jsx'
import PSBackground from './PSBackground.jsx'
import { usePalette } from './PaletteProvider'

const AdaptiveBackground = ({ className = '', defaultType = 'perlin' }) => {
  const [backgroundType, setBackgroundType] = useState(defaultType)
  const { palette } = usePalette()

  // 🎯 Keyboard shortcut to switch background types
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        setBackgroundType(prev => prev === 'perlin' ? 'dithered' : 'perlin')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 🎯 PlayStation palette: dedicated waves + bubbles background
  if (palette === 'ps') return <PSBackground className={className} />

  return (
      <>
        {backgroundType === 'perlin' ? (
          <PerlinBackground className={className} />
        ) : (
          <DitheredPerlinBackground className={className} />
        )}
        {/* 🎯 PlayStation palette on the Perlin background: bubbles layered on top */}
        {palette === 'ps-perlin' && <PSBackground className={className} bubblesOnly />}
      </>
  )
}

export default AdaptiveBackground 