"use client"
import { useState, useEffect } from 'react'
import PerlinBackground from './perlinBackground.jsx'
import DitheredPerlinBackground from './DitheredPerlinBackground.jsx'
import AquaBackground from './AquaBackground.jsx'
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

  // 🎯 Aqua palette: dedicated waves + bubbles background
  if (palette === 'aqua') return <AquaBackground className={className} />

  return (
      <>
        {backgroundType === 'perlin' ? (
          <PerlinBackground className={className} />
        ) : (
          <DitheredPerlinBackground className={className} />
        )}
      </>
  )
}

export default AdaptiveBackground 