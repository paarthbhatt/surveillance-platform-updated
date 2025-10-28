import { type NextRequest, NextResponse } from "next/server"
import { loadYOLOModel, detectObjects } from "@/lib/yolo-detector"
import { analyzeThreat } from "@/lib/threat-detector"
import { encryptData } from "@/lib/encryption"

export async function POST(req: NextRequest) {
  try {
    const { imageData, frameWidth, frameHeight } = await req.json()

    if (!imageData) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 })
    }

    // Load model
    try {
      await loadYOLOModel()
    } catch (modelError) {
      console.error("[v0] Failed to load YOLO model:", modelError)
      return NextResponse.json({ error: "Failed to load YOLO model" }, { status: 500 })
    }

    // Create image element from base64
    const img = new Image()
    img.src = imageData

    // Wait for image to load
    await new Promise((resolve) => {
      img.onload = resolve
    })

    // Detect objects
    const detectionResult = await detectObjects(img)

    // Analyze threats
    const threats = analyzeThreat(detectionResult.detections, frameWidth, frameHeight)

    // Encrypt detection data
    const encryptedData = encryptData({
      detections: detectionResult.detections,
      threats,
      processingTime: detectionResult.processingTime,
    })

    return NextResponse.json({
      success: true,
      detections: detectionResult.detections,
      threats,
      processingTime: detectionResult.processingTime,
      encryptedData,
    })
  } catch (error) {
    console.error("[v0] YOLO detection error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Detection failed" },
      { status: 500 },
    )
  }
}
