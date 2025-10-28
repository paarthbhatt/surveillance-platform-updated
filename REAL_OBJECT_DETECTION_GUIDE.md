# Real Object Detection from CCTV Footage

## What You Asked For

You want to detect real objects from actual CCTV video footage, not just simulated data. This includes:
- Identifying threats (weapons, suspicious behavior)
- Distinguishing between known and unknown personnel
- Real-time video processing

## How to Implement (Free Options)

### Option 1: TensorFlow.js (Browser-Based, Free)
**Best for**: Quick implementation, no backend needed

\`\`\`typescript
// Install: npm install @tensorflow/tfjs @tensorflow-models/coco-ssd

import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

async function detectObjects(videoElement: HTMLVideoElement) {
  const model = await cocoSsd.load();
  
  const predictions = await model.estimateObjects(videoElement);
  
  predictions.forEach(prediction => {
    console.log(prediction.class); // 'person', 'car', 'knife', etc.
    console.log(prediction.score); // confidence 0-1
  });
}
\`\`\`

### Option 2: MediaPipe (Google's Free Framework)
**Best for**: Pose detection, hand tracking, face detection

\`\`\`typescript
// Install: npm install @mediapipe/tasks-vision

import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

async function detectPose(videoElement: HTMLVideoElement) {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );
  
  const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
    },
    runningMode: 'VIDEO'
  });
  
  const results = poseLandmarker.detectForVideo(videoElement, Date.now());
  console.log(results.landmarks); // Detected body keypoints
}
\`\`\`

### Option 3: YOLO.js (Lightweight, Free)
**Best for**: Fast object detection on edge devices

\`\`\`typescript
// Install: npm install yolov8

import { YOLO } from 'yolov8';

const yolo = new YOLO();

async function detectWithYOLO(videoElement: HTMLVideoElement) {
  const results = await yolo.detect(videoElement);
  
  results.forEach(result => {
    console.log(result.class); // Object class
    console.log(result.confidence); // Confidence score
    console.log(result.bbox); // Bounding box
  });
}
\`\`\`

## Threat Detection Implementation

\`\`\`typescript
// Threat detection logic
function analyzeThreat(detectedObjects: any[]) {
  const threats = {
    weapons: ['knife', 'gun', 'rifle', 'sword'],
    suspicious: ['person_running', 'person_climbing'],
    unknown: [] // Personnel not in whitelist
  };
  
  const detectedThreats = detectedObjects.filter(obj => {
    return threats.weapons.includes(obj.class) || 
           threats.suspicious.includes(obj.class);
  });
  
  if (detectedThreats.length > 0) {
    triggerAlert('THREAT DETECTED', detectedThreats);
  }
}
\`\`\`

## Known vs Unknown Personnel

\`\`\`typescript
// Personnel recognition
const knownPersonnel = [
  { id: 'emp-001', name: 'John Doe', faceEncoding: [...] },
  { id: 'emp-002', name: 'Jane Smith', faceEncoding: [...] }
];

async function identifyPerson(faceEncoding: any[]) {
  const known = knownPersonnel.find(person => {
    const distance = calculateDistance(faceEncoding, person.faceEncoding);
    return distance < 0.6; // Threshold for match
  });
  
  if (!known) {
    triggerAlert('UNKNOWN PERSON DETECTED');
  }
  
  return known;
}
\`\`\`

## Integration with Your Platform

Add a new page `/tracking/video-analysis`:

\`\`\`tsx
// app/tracking/video-analysis/page.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

export default function VideoAnalysisPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [detections, setDetections] = useState([])
  
  useEffect(() => {
    const loadModel = async () => {
      const model = await cocoSsd.load()
      
      const detect = async () => {
        if (videoRef.current) {
          const predictions = await model.estimateObjects(videoRef.current)
          setDetections(predictions)
          
          // Draw on canvas
          drawDetections(predictions)
        }
      }
      
      const interval = setInterval(detect, 100)
      return () => clearInterval(interval)
    }
    
    loadModel()
  }, [])
  
  const drawDetections = (predictions: any[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    predictions.forEach(pred => {
      const [x, y, width, height] = pred.bbox
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)
      ctx.fillStyle = '#00ff00'
      ctx.fillText(`${pred.class} ${(pred.score * 100).toFixed(1)}%`, x, y - 5)
    })
  }
  
  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} />
    </div>
  )
}
\`\`\`

## Next Steps

1. Choose one of the three options above
2. Install the library: `npm install [library-name]`
3. Create a new page for video analysis
4. Integrate with your tracking system
5. Add threat detection logic
6. Deploy to Vercel

All options are completely free and work in the browser!
