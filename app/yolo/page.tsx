"use client"

import { YOLODetector } from "@/components/yolo-detector"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"

export default function YOLOPage() {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Real-Time Object Detection</h2>
              <p className="text-muted-foreground">
                YOLO-based object detection with webcam, CCTV footage upload, and threat analysis
              </p>
            </div>

            <YOLODetector />
          </div>
        </main>
      </div>
    </div>
  )
}
