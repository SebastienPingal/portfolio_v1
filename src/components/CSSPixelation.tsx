// components/CssPixelation.jsx
'use client'

import { useState, useEffect } from 'react'

export default function CssPixelation({ children, initialEnabled = true, initialPixelSize = 2, showControls = true }) {
  const [pixelSize, setPixelSize] = useState(initialPixelSize)
  const [enabled, setEnabled] = useState(initialEnabled)
  
  useEffect(() => {
    if (enabled) {
      document.documentElement.style.filter = `blur(0.5px) contrast(1.4) saturate(1.8) sepia(0.1) url("data:image/svg+xml,%3Csvg viewBox='0 0 ${pixelSize} ${pixelSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pixelate'%3E%3CfeFlood x='0' y='0' width='1' height='1'/%3E%3CfeComposite width='${pixelSize}' height='${pixelSize}'/%3E%3CfeTile result='a'/%3E%3CfeComposite in='SourceGraphic' in2='a' operator='in'/%3E%3CfeMorphology operator='dilate' radius='${pixelSize * 0.5}'/%3E%3C/filter%3E%3C/svg%3E#pixelate")`
    } else {
      document.documentElement.style.filter = 'none'
    }

    return () => {
      document.documentElement.style.filter = 'none'
    }
  }, [enabled, pixelSize])

  return (
    <>
      {children}
      
      {showControls && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '5px',
          color: 'white',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button 
            onClick={() => setEnabled(!enabled)}
            style={{
              padding: '5px 10px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {enabled ? 'Disable' : 'Enable'} Pixelation
          </button>
          
          <label>
            Pixel Size: {pixelSize}px
            <input
              type="range"
              min="2"
              max="20"
              value={pixelSize}
              onChange={(e) => setPixelSize(parseInt(e.target.value))}
              style={{ width: '100px', marginLeft: '10px' }}
            />
          </label>
        </div>
      )}
    </>
  )
}