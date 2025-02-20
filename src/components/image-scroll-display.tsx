"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface ImageScrollDisplayProps {
  images: string[]
  height: number
  mobileHeight?: number
}

export default function ImageScrollDisplay({ 
  images, 
  height,
  mobileHeight = height / 2
}: ImageScrollDisplayProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [totalWidth, setTotalWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gap = 128 // 32 * 4px (Tailwind's gap-32 is 8rem or 128px)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollStart, setScrollStart] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const preloadImages = async () => {
      const currentHeight = isMobile ? mobileHeight : height
      const promises = images.map(src => {
        return new Promise<{ width: number, height: number }>((resolve) => {
          const img = new window.Image()
          img.src = src
          img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight
            const adjustedHeight = img.naturalHeight > currentHeight ? currentHeight : img.naturalHeight
            const adjustedWidth = adjustedHeight * aspectRatio
            resolve({ width: adjustedWidth, height: adjustedHeight })
          }
          img.onerror = () => resolve({ width: 0, height: 0 })
        })
      })

      const dimensions = await Promise.all(promises)
      console.log("🖼️ Image dimensions (adjusted):", dimensions)
      const calculatedTotalWidth = dimensions.reduce((acc, { width }, index) => {
        return acc + width + (index < dimensions.length - 1 ? gap : 0)
      }, 0)

      setTotalWidth(calculatedTotalWidth)
      setDimensions(dimensions)
      console.log("📏 Total width calculated (adjusted):", calculatedTotalWidth)
    }

    preloadImages()
  }, [images, height, mobileHeight, isMobile])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      setIsDragging(true)
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      setStartX(clientX)
      setScrollStart(scrollPosition)
    }

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      setIsDragging(false)

      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
      const deltaX = startX - clientX
      const minSwipeDistance = 50 // Minimum distance to consider it a swipe

      // Calculate positions for each image
      const containerWidth = container.getBoundingClientRect().width
      let positions: number[] = []
      let currentPosition = 0
      dimensions.forEach(({ width }, index) => {
        positions.push(currentPosition)
        currentPosition += width + (index < dimensions.length - 1 ? gap : 0)
      })

      // Find the closest position to current scroll
      const currentIndex = positions.reduce((prev, curr, index) => {
        return Math.abs(curr - scrollPosition) < Math.abs(positions[prev] - scrollPosition) 
          ? index 
          : prev
      }, 0)

      let targetIndex = currentIndex

      // If the drag distance is significant, move exactly one position
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && currentIndex < positions.length - 1) {
          // Swiped left - go to next
          targetIndex = currentIndex + 1
        } else if (deltaX < 0 && currentIndex > 0) {
          // Swiped right - go to previous
          targetIndex = currentIndex - 1
        }
      }

      const maxScroll = totalWidth - containerWidth
      const targetPosition = Math.max(0, Math.min(positions[targetIndex], maxScroll))
      setScrollPosition(targetPosition)
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const deltaX = clientX - startX
      const containerWidth = container.getBoundingClientRect().width
      const maxScroll = totalWidth - containerWidth
      const newPosition = Math.max(0, Math.min(scrollStart - deltaX, maxScroll))
      
      setScrollPosition(newPosition)
    }

    // Add both mouse and touch event listeners
    container.addEventListener("mousedown", handleStart)
    container.addEventListener("touchstart", handleStart)
    window.addEventListener("mouseup", handleEnd)
    window.addEventListener("touchend", handleEnd)
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("touchmove", handleMove)

    return () => {
      container.removeEventListener("mousedown", handleStart)
      container.removeEventListener("touchstart", handleStart)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchend", handleEnd)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleMove)
    }
  }, [dimensions, gap, totalWidth, isDragging, startX, scrollStart, scrollPosition])

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ height: `${isMobile ? mobileHeight : height}px` }}
    >
      <div
        className="flex transition-transform duration-100 ease-out gap-32"
        style={{
          transform: `translateX(-${scrollPosition}px)`,
          width: totalWidth,
          transitionDuration: '800ms',
        }}
      >
        {images.map((src, index) => {
          const { width: imageWidth, height: imageHeight } = dimensions[index] || { width: 1000, height: 1000 }
          return (
            <div key={`${src}-${index}`} className="flex-shrink-0" style={{ height: `${imageHeight}px` }}>
              <Image
                src={src || "/placeholder.svg"}
                alt={`Image ${index + 1}`}
                height={imageHeight}
                width={imageWidth}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

