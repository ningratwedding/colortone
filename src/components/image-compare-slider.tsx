
"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ImagePlaceholder } from "@/lib/data"

interface ImageCompareSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  beforeImage: ImagePlaceholder
  afterImage: ImagePlaceholder
  initialPosition?: number
}

export function ImageCompareSlider({
  beforeImage,
  afterImage,
  initialPosition = 50,
  className,
  ...props
}: ImageCompareSliderProps) {
  const [sliderPosition, setSliderPosition] = React.useState(initialPosition)
  const [isDragging, setIsDragging] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMove = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent | React.TouchEvent<HTMLDivElement> | TouchEvent
  ) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x =
      ("touches" in event ? event.touches[0].clientX : event.clientX) -
      rect.left
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100))

    setSliderPosition(position)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      handleMove(e)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMove)
      document.addEventListener("touchmove", handleGlobalMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMove)
      document.removeEventListener("touchmove", handleGlobalMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden select-none", className)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      {...props}
    >
      <Image
        src={beforeImage.imageUrl}
        alt={beforeImage.description}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        data-ai-hint={beforeImage.imageHint}
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={afterImage.imageUrl}
          alt={afterImage.description}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={afterImage.imageHint}
          className="object-cover"
          priority
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 w-px bg-white/50 backdrop-blur-sm cursor-ew-resize flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-600">
          <ChevronLeft className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
