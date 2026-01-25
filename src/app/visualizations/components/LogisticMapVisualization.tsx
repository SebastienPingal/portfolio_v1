"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { logisticMap } from '@/lib/math/logisticMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export const LogisticMapVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [iterations, setIterations] = useState(200)
  const [settleIterations, setSettleIterations] = useState(300)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, dpr: 1 })

  // Handle resizing and DPR
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return
      
      const { width, height } = containerRef.current.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      setDimensions({ width, height, dpr })
    }

    const observer = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    updateDimensions()
    return () => observer.disconnect()
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height, dpr } = dimensions
    
    // Set internal resolution
    canvas.width = width * dpr
    canvas.height = height * dpr
    
    // Scale context for DPR
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    // Draw bifurcation diagram
    // We iterate over every horizontal pixel for maximum sharpness
    for (let xPixel = 0; xPixel < width; xPixel++) {
      // Map pixel to R value [2.4, 4.0]
      const r = 2.4 + (xPixel / width) * (4.0 - 2.4)
      let x = 0.5

      // Let the system settle into its attractor
      for (let i = 0; i < settleIterations; i++) {
        x = logisticMap(x, r)
      }

      // Draw the attractor points
      for (let i = 0; i < iterations; i++) {
        x = logisticMap(x, r)
        const yPixel = height - (x * height)
        
        // Dynamic color based on r and x
        // Sharper points with lower opacity for better blending
        const hue = (r - 2.4) * 120 + (x * 60)
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.2)`
        
        // Use a tiny 1x1 rect at full resolution
        ctx.fillRect(xPixel, yPixel, 0.8, 0.8)
      }
    }
  }, [dimensions, iterations, settleIterations])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Bifurcation Diagram
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div 
          ref={containerRef}
          className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Label>Iterations density: {iterations}</Label>
              <span className="text-xs text-muted-foreground font-mono">{iterations} pts/R</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="1000" 
              step="10"
              value={iterations} 
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Label>Precision (Settling): {settleIterations}</Label>
              <span className="text-xs text-muted-foreground font-mono">{settleIterations} steps</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="50"
              value={settleIterations} 
              onChange={(e) => setSettleIterations(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
