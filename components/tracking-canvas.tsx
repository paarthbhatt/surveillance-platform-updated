"use client"

import { useEffect, useRef } from "react"

interface DetectedObject {
  id: number
  class: string
  bbox: [number, number, number, number]
  confidence: number
  centroid: [number, number]
}

interface TrackingCanvasProps {
  objects: DetectedObject[]
  width?: number
  height?: number
}

// Format number: 2 decimal places for decimals, keep integers as-is
const formatNumber = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return value.toFixed(2)
}

export function TrackingCanvas({ objects, width = 1920, height = 1080 }: TrackingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "rgba(0, 212, 255, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 100) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 100) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw objects
    objects.forEach((obj) => {
      const scaleX = canvas.width / width
      const scaleY = canvas.height / height

      const x = obj.bbox[0] * scaleX
      const y = obj.bbox[1] * scaleY
      const w = obj.bbox[2] * scaleX
      const h = obj.bbox[3] * scaleY

      // Draw bounding box
      const color = obj.class === "person" ? "#ff6b35" : "#ff0080"
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, h)

      // Draw label
      ctx.fillStyle = color
      ctx.font = "12px monospace"
      ctx.fillText(`${obj.class} (${formatNumber(obj.confidence * 100)}%)`, x, y - 5)

      // Draw centroid
      ctx.fillStyle = "#00ff88"
      ctx.beginPath()
      ctx.arc(obj.centroid[0] * scaleX, obj.centroid[1] * scaleY, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [objects, width, height])

  return <canvas ref={canvasRef} width={640} height={480} className="w-full border border-cyan-500/30 rounded" />
}
