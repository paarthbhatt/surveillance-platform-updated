"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Play, Square, Upload, AlertTriangle, Loader2 } from "lucide-react"

interface Detection {
  class: string
  score: number
  bbox: [number, number, number, number]
  centroid: [number, number]
}

export function YOLODetector() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isRunning, setIsRunning] = useState(false)
  const [detections, setDetections] = useState<Detection[]>([])
  const [fps, setFps] = useState(0)
  const renderFpsRef = useRef({ frames: 0, last: Date.now() })
  const [model, setModel] = useState<any>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statusText, setStatusText] = useState("Model idle")
  const [rawOutput, setRawOutput] = useState<string>("")

  const animationFrameRef = useRef<number>()
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() })
  const lastDetectAtRef = useRef<number>(0)
  const targetIntervalMsRef = useRef<number>(200) // default for CPU; ~5 FPS
  const detectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastDetectionsRef = useRef<Detection[]>([])

  // Load model on mount
  useEffect(() => {
    const initModel = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamically import TensorFlow.js
        const tf = await import("@tensorflow/tfjs")
        // Register CPU backend explicitly and use it to avoid repeated WebGL attempts in unsupported envs
        await import("@tensorflow/tfjs-backend-cpu")
        await tf.setBackend("cpu")
        await tf.ready()

        // Load COCO-SSD model
        const cocoSsd = await import("@tensorflow-models/coco-ssd")
        const loadedModel = await cocoSsd.load()

        setModel(loadedModel)
        setModelLoaded(true)
        console.log("✅ YOLO model loaded successfully with backend:", tf.getBackend())
        // Tune target interval based on backend
        targetIntervalMsRef.current = tf.getBackend() === "cpu" ? 200 : 66 // ~5 FPS CPU, ~15 FPS WebGL
        setStatusText("Model loaded")
      } catch (err) {
        console.error("[YOLO] Model loading error:", err)
        setError(
          "Failed to load YOLO model. Please make sure you have a stable internet connection and refresh the page.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    initModel()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (isRunning && videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  // Start webcam
  const startWebcam = async () => {
    try {
      if (!modelLoaded || !model) {
        setError("YOLO model not loaded yet. Please wait...")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              resolve()
            }
          }
        })

        // Set canvas dimensions to match video
        if (canvasRef.current && videoRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth || 640
          canvasRef.current.height = videoRef.current.videoHeight || 480
        }

        setIsRunning(true)
        setError(null)
        startDrawLoop()
        startDetectLoop()
      }
    } catch (err) {
      setError("Failed to access webcam. Please check permissions.")
      console.error(err)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsRunning(false)
      setDetections([])
      setFps(0)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (detectIntervalRef.current) {
        clearInterval(detectIntervalRef.current)
        detectIntervalRef.current = null
      }
      setStatusText("Stopped")
    }
  }

  // Draw loop: smooth canvas rendering with last detections
  const startDrawLoop = () => {
    const draw = () => {
      // Always schedule next frame to keep FPS moving
      animationFrameRef.current = requestAnimationFrame(draw)

      if (!isRunning || !canvasRef.current) return

      const ctx = canvasRef.current.getContext("2d")
      const currentVideo = fileVideoRef.current && !fileVideoRef.current.paused ? fileVideoRef.current : videoRef.current
      if (ctx && currentVideo && canvasRef.current) {
        // Draw video frame
        ctx.drawImage(currentVideo, 0, 0, canvasRef.current.width, canvasRef.current.height)
        // Overlay last known detections
        if (lastDetectionsRef.current.length > 0) {
          drawDetectionsOnCanvas(canvasRef.current, lastDetectionsRef.current, ctx)
        }
      }

      // Update render FPS
      renderFpsRef.current.frames++
      const now = Date.now()
      if (now - renderFpsRef.current.last >= 1000) {
        setFps(renderFpsRef.current.frames)
        renderFpsRef.current.frames = 0
        renderFpsRef.current.last = now
      }
    }

    animationFrameRef.current = requestAnimationFrame(draw)
  }

  // Detection loop: run model on a throttled interval
  const startDetectLoop = () => {
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current)
    detectIntervalRef.current = setInterval(async () => {
      try {
        if (!isRunning || !model) return
        setStatusText("Detecting...")
        const inputEl = (fileVideoRef.current && !fileVideoRef.current.paused ? fileVideoRef.current : videoRef.current) ?? canvasRef.current
        if (!inputEl) return
        const predictions = await model.detect(inputEl as HTMLVideoElement, 10)
        const detected: Detection[] = predictions.map((pred: any) => {
          const [x, y, width, height] = pred.bbox
          return {
            class: pred.class,
            score: pred.score,
            bbox: [x, y, width, height],
            centroid: [x + width / 2, y + height / 2],
          }
        })
        lastDetectionsRef.current = detected
        setDetections(detected)
        setRawOutput(JSON.stringify(
          detected.map(d => ({ class: d.class, score: Number((d.score*100).toFixed(1)), bbox: d.bbox })),
          null,
          2,
        ))
        setStatusText(`Detections: ${detected.length}`)
      } catch (err) {
        console.error("[YOLO] Detection error:", err)
        setStatusText("Detection error")
      }
    }, targetIntervalMsRef.current)
  }

  // Manual snapshot: capture current video frame to canvas and run detect once
  const captureAndDetect = async () => {
    try {
      if (!model || !canvasRef.current) return
      const ctx = canvasRef.current.getContext("2d")
      const src = (fileVideoRef.current && !fileVideoRef.current.paused ? fileVideoRef.current : videoRef.current)
      if (!ctx || !src) return
      canvasRef.current.width = src.videoWidth || canvasRef.current.width
      canvasRef.current.height = src.videoHeight || canvasRef.current.height
      ctx.drawImage(src, 0, 0, canvasRef.current.width, canvasRef.current.height)
      setStatusText("Detecting (snapshot)...")
      const predictions = await model.detect(canvasRef.current, 10)
      const detected: Detection[] = predictions.map((pred: any) => {
        const [x, y, width, height] = pred.bbox
        return {
          class: pred.class,
          score: pred.score,
          bbox: [x, y, width, height],
          centroid: [x + width / 2, y + height / 2],
        }
      })
      lastDetectionsRef.current = detected
      setDetections(detected)
      drawDetectionsOnCanvas(canvasRef.current, detected, ctx)
      setRawOutput(JSON.stringify(
        detected.map(d => ({ class: d.class, score: Number((d.score*100).toFixed(1)), bbox: d.bbox })),
        null,
        2,
      ))
      setStatusText(`Snapshot detections: ${detected.length}`)
    } catch (e) {
      console.error("[YOLO] Snapshot detect error:", e)
      setStatusText("Snapshot detection error")
    }
  }

  // Draw detections on canvas
  const drawDetectionsOnCanvas = (canvas: HTMLCanvasElement, detections: Detection[], ctx?: CanvasRenderingContext2D) => {
    const context = ctx || canvas.getContext("2d")
    if (!context) return

    // Draw detections on top of existing canvas content
    detections.forEach((detection) => {
      const [x, y, width, height] = detection.bbox
      const confidence = (detection.score * 100).toFixed(1)

      // Draw bounding box
      context.strokeStyle = "#00ff00"
      context.lineWidth = 2
      context.strokeRect(x, y, width, height)

      // Draw label background
      const label = `${detection.class} ${confidence}%`
      context.font = "bold 14px Arial"
      const textWidth = context.measureText(label).width
      context.fillStyle = "#00ff00"
      context.fillRect(x, y - 25, textWidth + 10, 25)

      // Draw label text
      context.fillStyle = "#000000"
      context.fillText(label, x + 5, y - 8)

      // Draw centroid
      context.fillStyle = "#ff0000"
      context.beginPath()
      context.arc(detection.centroid[0], detection.centroid[1], 3, 0, 2 * Math.PI)
      context.fill()
    })
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!modelLoaded || !model) {
      setError("YOLO model not loaded yet. Please wait...")
      return
    }

    try {
      setError(null)
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = async (event) => {
          const img = new Image()
          img.onload = async () => {
            try {
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d")
                if (ctx) {
                  canvasRef.current.width = img.width
                  canvasRef.current.height = img.height
                  ctx.drawImage(img, 0, 0)
                }
              }
              const predictions = await model.detect(img, 10)
              const detected: Detection[] = predictions.map((pred: any) => {
                const [x, y, width, height] = pred.bbox
                return {
                  class: pred.class,
                  score: pred.score,
                  bbox: [x, y, width, height],
                  centroid: [x + width / 2, y + height / 2],
                }
              })
              setDetections(detected)
              if (canvasRef.current) drawDetectionsOnCanvas(canvasRef.current, detected)
              setStatusText(`Image detections: ${detected.length}`)
            } catch (err) {
              console.error("[YOLO] Detection error:", err)
              setError("Failed to detect objects in image")
            }
          }
          if (event.target?.result) {
            img.src = event.target.result as string
          }
        }
        reader.readAsDataURL(file)
      } else if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file)
        if (fileVideoRef.current) {
          fileVideoRef.current.src = url
          await fileVideoRef.current.play().catch(() => {})
          if (canvasRef.current && fileVideoRef.current) {
            canvasRef.current.width = fileVideoRef.current.videoWidth || 640
            canvasRef.current.height = fileVideoRef.current.videoHeight || 480
          }
          setIsRunning(true)
          setStatusText("Playing uploaded video")
          startDrawLoop()
          startDetectLoop()
        }
      }
    } catch (err) {
      setError("Failed to process image")
      console.error(err)
    }
  }

  const loadSample = async () => {
    if (!model) return
    const img = new Image()
    img.onload = async () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          canvasRef.current.width = img.width
          canvasRef.current.height = img.height
          ctx.drawImage(img, 0, 0)
        }
      }
      const predictions = await model.detect(img, 10)
      const detected: Detection[] = predictions.map((pred: any) => {
        const [x, y, width, height] = pred.bbox
        return {
          class: pred.class,
          score: pred.score,
          bbox: [x, y, width, height],
          centroid: [x + width / 2, y + height / 2],
        }
      })
      setDetections(detected)
      if (canvasRef.current) drawDetectionsOnCanvas(canvasRef.current, detected)
      setStatusText(`Sample detections: ${detected.length}`)
    }
    img.src = "/placeholder.jpg"
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Loading YOLO model... This may take a few moments.</AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Video/Canvas */}
      <Card>
        <CardHeader>
          <CardTitle>Camera Feed & Detection</CardTitle>
          <CardDescription>Real-time object detection using YOLO (COCO-SSD) model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              autoPlay
              playsInline
              muted
            />
            <video ref={fileVideoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none z-10" width={640} height={480} />
            {isRunning && (
              <div className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white z-10">
                LIVE - {fps} FPS
              </div>
            )}
            <div className="absolute top-2 left-2 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white z-10">
              {statusText}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={startWebcam}
              disabled={!modelLoaded || isRunning || isLoading}
              className="flex-1"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Detection
            </Button>
            <Button
              onClick={stopWebcam}
              disabled={!isRunning}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
              size="lg"
              disabled={!modelLoaded || isLoading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload CCTV
            </Button>
            <Button onClick={captureAndDetect} variant="outline" size="lg" disabled={!modelLoaded}>
              Capture Snapshot
            </Button>
            <Button onClick={loadSample} variant="outline" size="lg" disabled={!modelLoaded || isLoading}>
              Load Sample
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">{detections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Persons Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {detections.filter((d) => d.class === "person").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vehicles Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">
              {detections.filter((d) => d.class.includes("car") || d.class.includes("truck")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detections List */}
      {detections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Objects</CardTitle>
            <CardDescription>List of detected objects with confidence scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {detections.map((det, idx) => (
                <div key={idx} className="rounded border p-3 text-sm hover:bg-accent transition">
                  <div className="font-semibold text-foreground">{det.class}</div>
                  <div className="text-muted-foreground">Confidence: {(det.score * 100).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Position: ({Math.round(det.centroid[0])}, {Math.round(det.centroid[1])})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw output */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Output</CardTitle>
          <CardDescription>Structured results (class, confidence, bbox)</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs whitespace-pre-wrap break-all p-3 bg-muted rounded max-h-64 overflow-auto">
{rawOutput || "No results yet. Try Capture Snapshot or Start Detection."}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
