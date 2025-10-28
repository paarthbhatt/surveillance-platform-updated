import type { Detection } from "./yolo-detector"

export interface Threat {
  id: string
  type: "unknown_object" | "suspicious_behavior" | "unauthorized_personnel" | "abandoned_object" | "crowd_anomaly"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  detectedObject: Detection
  timestamp: string
  location?: string
}

// Known safe objects database
const KNOWN_OBJECTS = new Set([
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "bus",
  "truck",
  "traffic light",
  "fire hydrant",
  "stop sign",
  "parking meter",
  "bench",
  "cat",
  "dog",
  "horse",
  "sheep",
  "cow",
  "elephant",
  "bear",
  "zebra",
  "giraffe",
  "backpack",
  "umbrella",
  "handbag",
  "tie",
  "suitcase",
  "frisbee",
  "skis",
  "snowboard",
  "sports ball",
  "kite",
  "baseball bat",
  "baseball glove",
  "skateboard",
  "surfboard",
  "tennis racket",
  "bottle",
  "wine glass",
  "cup",
  "fork",
  "knife",
  "spoon",
  "bowl",
  "banana",
  "apple",
  "sandwich",
  "orange",
  "broccoli",
  "carrot",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "chair",
  "couch",
  "potted plant",
  "bed",
  "dining table",
  "toilet",
  "tv",
  "laptop",
  "mouse",
  "remote",
  "keyboard",
  "microwave",
  "oven",
  "toaster",
  "sink",
  "refrigerator",
  "book",
  "clock",
  "vase",
  "scissors",
  "teddy bear",
  "hair drier",
  "toothbrush",
])

// Restricted zones (example - can be configured per facility)
const RESTRICTED_ZONES = [
  { name: "Server Room", x: 0, y: 0, width: 100, height: 100 },
  { name: "Executive Office", x: 500, y: 500, width: 150, height: 150 },
]

// Track object history for behavior analysis
const objectHistory = new Map<string, Detection[]>()
const MAX_HISTORY = 30 // Keep last 30 frames

export function analyzeThreat(detections: Detection[], frameWidth: number, frameHeight: number): Threat[] {
  const threats: Threat[] = []

  detections.forEach((detection, index) => {
    const objectKey = `${detection.class}-${index}`

    // Update history
    if (!objectHistory.has(objectKey)) {
      objectHistory.set(objectKey, [])
    }
    const history = objectHistory.get(objectKey)!
    history.push(detection)
    if (history.length > MAX_HISTORY) {
      history.shift()
    }

    // Check for unknown objects
    if (!KNOWN_OBJECTS.has(detection.class.toLowerCase())) {
      threats.push({
        id: `unknown-${Date.now()}-${index}`,
        type: "unknown_object",
        severity: "high",
        description: `Unknown object detected: ${detection.class}`,
        detectedObject: detection,
        timestamp: new Date().toISOString(),
      })
    }

    // Check for low confidence detections (suspicious)
    if (detection.score < 0.6) {
      threats.push({
        id: `suspicious-${Date.now()}-${index}`,
        type: "suspicious_behavior",
        severity: "medium",
        description: `Low confidence detection: ${detection.class} (${(detection.score * 100).toFixed(1)}%)`,
        detectedObject: detection,
        timestamp: new Date().toISOString(),
      })
    }

    // Check for unauthorized personnel in restricted zones
    if (detection.class.toLowerCase() === "person") {
      const threat = checkRestrictedZones(detection, frameWidth, frameHeight)
      if (threat) {
        threats.push(threat)
      }
    }

    // Check for loitering behavior
    if (detection.class.toLowerCase() === "person" && history.length > 15) {
      const loiteringThreat = detectLoitering(detection, history)
      if (loiteringThreat) {
        threats.push(loiteringThreat)
      }
    }
  })

  // Check for crowd anomalies
  const personCount = detections.filter((d) => d.class.toLowerCase() === "person").length
  if (personCount > 10) {
    threats.push({
      id: `crowd-${Date.now()}`,
      type: "crowd_anomaly",
      severity: "medium",
      description: `High crowd density detected: ${personCount} persons`,
      detectedObject: detections[0],
      timestamp: new Date().toISOString(),
    })
  }

  return threats
}

function checkRestrictedZones(detection: Detection, frameWidth: number, frameHeight: number): Threat | null {
  const [x, y, width, height] = detection.bbox
  const centroid = detection.centroid

  for (const zone of RESTRICTED_ZONES) {
    // Normalize zone coordinates to frame dimensions
    const normalizedZone = {
      x: (zone.x / 1920) * frameWidth,
      y: (zone.y / 1080) * frameHeight,
      width: (zone.width / 1920) * frameWidth,
      height: (zone.height / 1080) * frameHeight,
    }

    // Check if centroid is in restricted zone
    if (
      centroid[0] >= normalizedZone.x &&
      centroid[0] <= normalizedZone.x + normalizedZone.width &&
      centroid[1] >= normalizedZone.y &&
      centroid[1] <= normalizedZone.y + normalizedZone.height
    ) {
      return {
        id: `unauthorized-${Date.now()}`,
        type: "unauthorized_personnel",
        severity: "critical",
        description: `Unauthorized personnel in ${zone.name}`,
        detectedObject: detection,
        timestamp: new Date().toISOString(),
        location: zone.name,
      }
    }
  }

  return null
}

function detectLoitering(detection: Detection, history: Detection[]): Threat | null {
  if (history.length < 15) return null

  // Calculate movement distance
  const recentHistory = history.slice(-15)
  let totalDistance = 0

  for (let i = 1; i < recentHistory.length; i++) {
    const prev = recentHistory[i - 1].centroid
    const curr = recentHistory[i].centroid
    const distance = Math.sqrt(Math.pow(curr[0] - prev[0], 2) + Math.pow(curr[1] - prev[1], 2))
    totalDistance += distance
  }

  const avgMovement = totalDistance / recentHistory.length

  // If average movement is very small, person is loitering
  if (avgMovement < 5) {
    return {
      id: `loitering-${Date.now()}`,
      type: "suspicious_behavior",
      severity: "medium",
      description: "Person loitering detected",
      detectedObject: detection,
      timestamp: new Date().toISOString(),
    }
  }

  return null
}

export function clearHistory() {
  objectHistory.clear()
}
