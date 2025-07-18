"use client"
import { useState, useEffect } from 'react'
import PerlinBackground from './perlinBackground.jsx'
import DitheredPerlinBackground from './DitheredPerlinBackground.jsx'

const AdaptiveBackground = ({ className = '', defaultType = 'perlin' }) => {
  const [backgroundType, setBackgroundType] = useState(defaultType)

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

  return (
    <>
      {backgroundType === 'perlin' ? (
        <PerlinBackground className={className} />
      ) : (
        <DitheredPerlinBackground className={className} />
      )}
      
      {/* 🎯 Background type indicator */}
      <div className="fixed top-4 left-4 z-50 text-xs text-foreground/50 pointer-events-none">
        Background: {backgroundType} (Ctrl+B to switch)
      </div>
    </>
  )
}

export default AdaptiveBackground 