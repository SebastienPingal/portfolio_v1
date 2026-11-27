"use client"
import { useState, useEffect } from 'react'
import PerlinBackground from './perlinBackground.jsx'
import DitheredPerlinBackground from './DitheredPerlinBackground.jsx'
import AquaBackground from './AquaBackground.jsx'
import { usePalette } from './PaletteProvider'
import { useAquaEffects } from './AquaEffectsProvider'

const AdaptiveBackground = ({ className = '', defaultType = 'perlin' }) => {
  const [backgroundType, setBackgroundType] = useState(defaultType)
  const { palette } = usePalette()
  const { isOn } = useAquaEffects()

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
  if (palette === 'aqua') return (
    <AquaBackground
      className={className}
      ribbons={isOn('ribbons')}
      sparkles={isOn('sparkles')}
      bokeh={isOn('bokeh')}
      rays={isOn('rays')}
      daycycle={isOn('daycycle')}
    />
  )

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