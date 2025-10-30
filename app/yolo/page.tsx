"use client"

import { YOLODetector } from "@/components/yolo-detector"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"

export default function YOLOPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Real-Time Object Detection</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
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
