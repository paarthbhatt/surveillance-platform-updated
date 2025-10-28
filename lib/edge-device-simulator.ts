// Edge Device Simulator - Simulates YOLOv8 object detection and tracking
// In production, this would run on Raspberry Pi/Jetson Nano with actual OpenCV + YOLOv8

import { encryptData } from "./encryption"

export interface DetectedObject {
  id: number
  class: string // 'person', 'vehicle', 'bicycle', etc.
  bbox: [number, number, number, number] // [x, y, width, height]
  confidence: number
  centroid: [number, number]
}

export interface TrackingFrame {
  timestamp: string
  device_id: string
  facility_id: string
  frame_number: number
  objects: DetectedObject[]
  frame_width: number
  frame_height: number
}

// Simulated object classes and their typical confidence ranges
const OBJECT_CLASSES = ["person", "vehicle", "bicycle", "backpack", "handbag"]

// Simulate realistic tracking data with movement patterns
export class EdgeDeviceSimulator {
  private deviceId: string
  private facilityId: string
  private frameNumber = 0
  private trackedObjects: Map<number, DetectedObject> = new Map()
  private nextObjectId = 1

  constructor(deviceId: string, facilityId: string) {
    this.deviceId = deviceId
    this.facilityId = facilityId
    this.initializeTrackedObjects()
  }

  private initializeTrackedObjects() {
    // Initialize some persistent tracked objects
    for (let i = 0; i < 3; i++) {
      const obj: DetectedObject = {
        id: this.nextObjectId++,
        class: OBJECT_CLASSES[Math.floor(Math.random() * OBJECT_CLASSES.length)],
        bbox: [Math.random() * 800, Math.random() * 600, Math.random() * 100 + 50, Math.random() * 100 + 50],
        confidence: Math.random() * 0.3 + 0.7,
        centroid: [0, 0],
      }
      this.trackedObjects.set(obj.id, obj)
    }
  }

  // Simulate realistic object movement and detection
  private updateObjectPositions() {
    const updatedObjects = new Map(this.trackedObjects)

    // Update existing objects with realistic movement
    updatedObjects.forEach((obj) => {
      // Simulate smooth movement
      obj.bbox[0] += (Math.random() - 0.5) * 20
      obj.bbox[1] += (Math.random() - 0.5) * 20

      // Keep objects within frame bounds
      obj.bbox[0] = Math.max(0, Math.min(obj.bbox[0], 800 - obj.bbox[2]))
      obj.bbox[1] = Math.max(0, Math.min(obj.bbox[1], 600 - obj.bbox[3]))

      // Update centroid
      obj.centroid = [obj.bbox[0] + obj.bbox[2] / 2, obj.bbox[1] + obj.bbox[3] / 2]

      // Randomly adjust confidence
      obj.confidence = Math.max(0.5, Math.min(1, obj.confidence + (Math.random() - 0.5) * 0.1))
    })

    // Randomly add new objects (5% chance)
    if (Math.random() < 0.05) {
      const newObj: DetectedObject = {
        id: this.nextObjectId++,
        class: OBJECT_CLASSES[Math.floor(Math.random() * OBJECT_CLASSES.length)],
        bbox: [Math.random() * 800, Math.random() * 600, 80, 80],
        confidence: Math.random() * 0.2 + 0.8,
        centroid: [0, 0],
      }
      newObj.centroid = [newObj.bbox[0] + newObj.bbox[2] / 2, newObj.bbox[1] + newObj.bbox[3] / 2]
      updatedObjects.set(newObj.id, newObj)
    }

    // Randomly remove objects (3% chance per object)
    updatedObjects.forEach((obj, id) => {
      if (Math.random() < 0.03) {
        updatedObjects.delete(id)
      }
    })

    this.trackedObjects = updatedObjects
  }

  // Generate a frame of tracking data
  generateFrame(): TrackingFrame {
    this.frameNumber++
    this.updateObjectPositions()

    return {
      timestamp: new Date().toISOString(),
      device_id: this.deviceId,
      facility_id: this.facilityId,
      frame_number: this.frameNumber,
      objects: Array.from(this.trackedObjects.values()),
      frame_width: 1920,
      frame_height: 1080,
    }
  }

  // Encrypt frame data for transmission
  encryptFrame(frame: TrackingFrame) {
    return encryptData({
      objects: frame.objects.map((obj) => ({
        id: obj.id,
        class: obj.class,
        bbox: obj.bbox,
        confidence: obj.confidence,
        centroid: obj.centroid,
      })),
      frame_number: frame.frame_number,
      timestamp: frame.timestamp,
    })
  }
}

// Simulate sending data to backend
export async function sendTrackingDataToBackend(
  frame: TrackingFrame,
  encryptedData: any,
  apiKey: string,
  backendUrl = "http://localhost:3000",
) {
  try {
    const response = await fetch(`${backendUrl}/api/tracking/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        device_id: frame.device_id,
        facility_id: frame.facility_id,
        timestamp: frame.timestamp,
        encrypted_data: encryptedData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Failed to send tracking data:", error)
    throw error
  }
}
