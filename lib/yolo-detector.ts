import * as cocoSsd from "@tensorflow-models/coco-ssd"

export interface Detection {
  class: string
  score: number
  bbox: [number, number, number, number] // [x, y, width, height]
  centroid: [number, number]
}

export interface DetectionResult {
  timestamp: string
  detections: Detection[]
  frameWidth: number
  frameHeight: number
  processingTime: number
}

let model: cocoSsd.ObjectDetection | null = null

export async function loadYOLOModel() {
  if (model) return model

  try {
    console.log("[v0] Loading COCO-SSD model...")
    model = await cocoSsd.load()
    console.log("[v0] COCO-SSD model loaded successfully")
    return model
  } catch (error) {
    console.error("[v0] Failed to load YOLO model:", error)
    throw error
  }
}

export async function detectObjects(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): Promise<DetectionResult> {
  if (!model) {
    throw new Error("Model not loaded. Call loadYOLOModel first.")
  }

  const startTime = performance.now()

  try {
    const predictions = await model.estimateObjects(imageElement, 6)

    const detections: Detection[] = predictions.map((pred) => {
      const [x, y, width, height] = pred.bbox
      return {
        class: pred.class,
        score: pred.score,
        bbox: [x, y, width, height],
        centroid: [x + width / 2, y + height / 2],
      }
    })

    const processingTime = performance.now() - startTime

    return {
      timestamp: new Date().toISOString(),
      detections,
      frameWidth: imageElement.width || 640,
      frameHeight: imageElement.height || 480,
      processingTime,
    }
  } catch (error) {
    console.error("[v0] Detection error:", error)
    throw error
  }
}

export function drawDetections(
  canvas: HTMLCanvasElement,
  detections: Detection[],
  frameWidth: number,
  frameHeight: number,
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw detections
  detections.forEach((detection) => {
    const [x, y, width, height] = detection.bbox
    const confidence = (detection.score * 100).toFixed(1)

    // Draw bounding box
    ctx.strokeStyle = "#00ff00"
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)

    // Draw label background
    const label = `${detection.class} ${confidence}%`
    const textWidth = ctx.measureText(label).width
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(x, y - 25, textWidth + 10, 25)

    // Draw label text
    ctx.fillStyle = "#000000"
    ctx.font = "bold 14px Arial"
    ctx.fillText(label, x + 5, y - 8)

    // Draw centroid
    ctx.fillStyle = "#ff0000"
    ctx.beginPath()
    ctx.arc(detection.centroid[0], detection.centroid[1], 3, 0, 2 * Math.PI)
    ctx.fill()
  })
}

export function disposeModel() {
  if (model) {
    model.dispose()
    model = null
  }
}
