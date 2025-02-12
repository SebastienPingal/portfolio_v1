"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface ImageScrollDisplayProps {
  images: string[]
  height: number
  width: number
}

export default function ImageScrollDisplay({ images, height }: ImageScrollDisplayProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [totalWidth, setTotalWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gap = 4
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

      const scrollPercentage = x / containerWidth
      const newScrollPosition = scrollPercentage * totalWidth

      setScrollPosition(newScrollPosition)
    }

    const handleMouseLeave = () => {
      console.log("🚪 Mouse left the container")
      setScrollPosition(0)
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [images, totalWidth])


  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <div
        className="flex transition-transform duration-100 ease-out gap-4"
        style={{
          transform: `translateX(-${scrollPosition}px)`,
          width: totalWidth,
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

