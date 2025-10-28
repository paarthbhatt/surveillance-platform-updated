"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { loadYOLOModel, detectObjects, drawDetections, disposeModel } from "@/lib/yolo-detector"
import { analyzeThreat, clearHistory } from "@/lib/threat-detector"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Play, Square, Upload } from "lucide-react"

interface Detection {
  class: string
  score: number
  bbox: [number, number, number, number]
  centroid: [number, number]
}

interface Threat {
  id: string
  type: string
  severity: string
  description: string
  timestamp: string
}

export function YOLODetector() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isRunning, setIsRunning] = useState(false)
  const [detections, setDetections] = useState<Detection[]>([])
  const [threats, setThreats] = useState<Threat[]>([])
  const [fps, setFps] = useState(0)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const animationFrameRef = useRef<number>()
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() })

  // Load model on mount
  useEffect(() => {
    const initModel = async () => {
      try {
        await loadYOLOModel()
        setModelLoaded(true)
      } catch (err) {
        setError("Failed to load YOLO model")
        console.error(err)
      }
    }

    initModel()

    return () => {
      disposeModel()
    }
  }, [])

  // Start webcam
  const startWebcam = async () => {
    try {
      if (!modelLoaded) {
        setError("YOLO model not loaded yet. Please wait...")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsRunning(true)
        setError(null)
        clearHistory()
        detectFrame()
      }
    } catch (err) {
      setError("Failed to access webcam")
      console.error(err)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsRunning(false)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  // Detect frame
  const detectFrame = async () => {
    if (!isRunning || !videoRef.current || !canvasRef.current || !modelLoaded) return

    try {
      const result = await detectObjects(videoRef.current)
      setDetections(result.detections)

      // Analyze threats
      const detectedThreats = analyzeThreat(result.detections, result.frameWidth, result.frameHeight)
      setThreats(detectedThreats)

      // Draw detections
      drawDetections(canvasRef.current, result.detections, result.frameWidth, result.frameHeight)

      // Update FPS
      fpsCounterRef.current.frames++
      const now = Date.now()
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        setFps(fpsCounterRef.current.frames)
        fpsCounterRef.current.frames = 0
        fpsCounterRef.current.lastTime = now
      }

      // Send threats to backend
      if (detectedThreats.length > 0) {
        await fetch("/api/yolo/threats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threats: detectedThreats,
            deviceId: "webcam-detector",
            facilityId: "main-facility",
          }),
        })
      }
    } catch (err) {
      console.error("[v0] Detection error:", err)
      if (err instanceof Error && err.message.includes("Model not loaded")) {
        setError("YOLO model not loaded. Please refresh the page.")
        stopWebcam()
      }
    }

    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(detectFrame)
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!modelLoaded) {
      setError("YOLO model not loaded yet. Please wait...")
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const imageData = event.target?.result as string
      try {
        const response = await fetch("/api/yolo/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageData,
            frameWidth: 640,
            frameHeight: 480,
          }),
        })

        const data = await response.json()
        if (data.error) {
          setError(data.error)
        } else {
          setDetections(data.detections)
          setThreats(data.threats)
          setError(null)
        }
      } catch (err) {
        setError("Failed to process image")
        console.error(err)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {!modelLoaded && !error && (
        <Card className="border-blue-500 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <AlertCircle className="h-5 w-5 animate-pulse" />
            <span>Loading YOLO model... This may take a few moments.</span>
          </div>
        </Card>
      )}

      {error && (
        <Card className="border-red-500 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Video/Canvas */}
        <Card className="p-4">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            <video ref={videoRef} className="absolute inset-0 h-full w-full" autoPlay playsInline />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" width={640} height={480} />
            {isRunning && (
              <div className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                LIVE - {fps} FPS
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={startWebcam} disabled={!modelLoaded || isRunning} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
            <Button onClick={stopWebcam} disabled={!isRunning} variant="destructive" className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        </Card>

        {/* Stats */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3">Detection Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Objects:</span>
                <span className="font-semibold">{detections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Persons:</span>
                <span className="font-semibold">{detections.filter((d) => d.class === "person").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicles:</span>
                <span className="font-semibold">
                  {detections.filter((d) => d.class.includes("car") || d.class.includes("truck")).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Threats:</span>
                <span className="font-semibold text-red-600">{threats.length}</span>
              </div>
            </div>
          </Card>

          {/* Threats */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3">Active Threats</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {threats.length === 0 ? (
                <p className="text-sm text-gray-500">No threats detected</p>
              ) : (
                threats.map((threat) => (
                  <div
                    key={threat.id}
                    className={`rounded p-2 text-xs ${
                      threat.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : threat.severity === "high"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <div className="font-semibold">{threat.type}</div>
                    <div>{threat.description}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Detections List */}
      {detections.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-3">Detected Objects</h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {detections.map((det, idx) => (
              <div key={idx} className="rounded border p-2 text-sm">
                <div className="font-semibold">{det.class}</div>
                <div className="text-gray-600">Confidence: {(det.score * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
