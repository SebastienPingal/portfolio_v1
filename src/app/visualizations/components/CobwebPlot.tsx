"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { logisticMap } from '@/lib/math/logisticMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Play, Pause } from 'lucide-react'

export const CobwebPlot = () => {
  const t = useTranslations('Visualizations.cobweb')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [r, setR] = useState(3.7)
  const [x0, setX0] = useState(0.5)
  const [iterations, setIterations] = useState(50)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, dpr: 1 })
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(0.002)

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      setDimensions({ width, height, dpr })
    }

    const observer = new ResizeObserver(updateDimensions)
    if (containerRef.current) observer.observe(containerRef.current)
    updateDimensions()
    return () => observer.disconnect()
  }, [])

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number
    
    const animate = () => {
      if (isAnimating) {
        setR(prevR => {
          let nextR = prevR + animationSpeed
          if (nextR > 4) {
            nextR = 4
            setIsAnimating(false)
          }
          if (nextR < 0) {
            nextR = 0
            setIsAnimating(false)
          }
          return nextR
        })
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    if (isAnimating) {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => cancelAnimationFrame(animationFrameId)
  }, [isAnimating, animationSpeed])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height, dpr } = dimensions
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const plotSize = Math.min(width * 0.6, height - 40)
    const offsetX = 20
    const offsetY = 20

    ctx.clearRect(0, 0, width, height)
    
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.translate(offsetX, offsetY)

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, plotSize)
    ctx.lineTo(plotSize, plotSize)
    ctx.moveTo(0, 0)
    ctx.lineTo(0, plotSize)
    ctx.stroke()

    ctx.strokeStyle = '#444'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, plotSize)
    ctx.lineTo(plotSize, 0)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= 100; i++) {
      const xVal = i / 100
      const yVal = logisticMap(xVal, r)
      const px = xVal * plotSize
      const py = plotSize - (yVal * plotSize)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    let currentX = x0
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(currentX * plotSize, plotSize)
    
    for (let i = 0; i < iterations; i++) {
      const nextX = logisticMap(currentX, r)
      ctx.lineTo(currentX * plotSize, plotSize - (nextX * plotSize))
      ctx.lineTo(nextX * plotSize, plotSize - (nextX * plotSize))
      currentX = nextX
    }
    ctx.stroke()
    
    ctx.fillStyle = '#fbbf24'
    ctx.shadowBlur = 10
    ctx.shadowColor = '#fbbf24'
    ctx.beginPath()
    ctx.arc(currentX * plotSize, plotSize - (currentX * plotSize), 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.restore()

    const tsX = plotSize + offsetX + 40
    const tsWidth = width - tsX - 20
    if (tsWidth > 100) {
      ctx.save()
      ctx.translate(tsX, offsetY)
      
      ctx.strokeStyle = '#333'
      ctx.beginPath()
      ctx.moveTo(0, plotSize)
      ctx.lineTo(tsWidth, plotSize)
      ctx.moveTo(0, 0)
      ctx.lineTo(0, plotSize)
      ctx.stroke()

      let sx = x0
      ctx.strokeStyle = '#10b981'
      ctx.beginPath()
      ctx.moveTo(0, plotSize - (sx * plotSize))
      
      for (let i = 1; i <= iterations; i++) {
        sx = logisticMap(sx, r)
        const px = (i / iterations) * tsWidth
        const py = plotSize - (sx * plotSize)
        ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.restore()
    }

  }, [dimensions, r, x0, iterations])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle>{t('title')}</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1 items-end">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('speed')}</Label>
            <input 
              type="range" 
              min="0.0005" 
              max="0.01" 
              step="0.0005"
              value={animationSpeed} 
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-24 h-1 accent-primary"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsAnimating(!isAnimating)}
            className="rounded-full h-10 w-10 border-2"
          >
            {isAnimating ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div 
          ref={containerRef}
          className="relative h-[400px] w-full overflow-hidden rounded-lg bg-[#0a0a0a] shadow-inner"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Label>{t('growthRate')}: {r.toFixed(3)}</Label>
              <span className="text-xs font-mono text-indigo-400">{t('functionCurve')}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="4" 
              step="0.001"
              value={r} 
              onChange={(e) => setR(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-[10px] text-muted-foreground italic">
              {t('tryValues')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Label>{t('initialValue')}: {x0.toFixed(3)}</Label>
              <span className="text-xs font-mono text-rose-400">{t('cobwebPath')}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={x0} 
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Label>{t('steps')}: {iterations}</Label>
              <span className="text-xs font-mono text-emerald-400">{t('timeSeries')}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="200" 
              step="1"
              value={iterations} 
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
