"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface ImageScrollDisplayProps {
  images: string[]
  height: number
}

export default function ImageScrollDisplay({ images, height }: ImageScrollDisplayProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [totalWidth, setTotalWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gap = 128 // 32 * 4px (Tailwind's gap-32 is 8rem or 128px)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }[]>([])

  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map(src => {
        return new Promise<{ width: number, height: number }>((resolve) => {
          const img = new window.Image()
          img.src = src
          img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight
            const adjustedHeight = img.naturalHeight > height ? height : img.naturalHeight
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
  }, [images, height])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const containerWidth = rect.width

      // Calculate snap positions at the start of each image
      let positions: number[] = []
      let currentPosition = 0
      dimensions.forEach(({ width }, index) => {
        positions.push(currentPosition)
        currentPosition += width + (index < dimensions.length - 1 ? gap : 0)
      })

      // Calculate scroll position based on mouse position
      const maxScroll = totalWidth - containerWidth
      const scrollPercentage = x / containerWidth
      const rawScrollPosition = maxScroll * scrollPercentage

      // Find the closest snap position
      const closestPosition = positions.reduce((prev: number, curr: number) => {
        return Math.abs(curr - rawScrollPosition) < Math.abs(prev - rawScrollPosition) ? curr : prev
      }, positions[0])

      // Always apply magnetic effect with fixed strength
      const magnetStrength = 1 // Strong snap effect
      const finalPosition = rawScrollPosition * (1 - magnetStrength) + 
                          closestPosition * magnetStrength

      setScrollPosition(Math.max(0, Math.min(finalPosition, maxScroll)))
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [dimensions, gap, totalWidth])


  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${height}px` }}>
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

