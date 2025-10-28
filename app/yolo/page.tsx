import { YOLODetector } from "@/components/yolo-detector"

export default function YOLOPage() {
  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Real-Time Object Detection</h1>
        <p className="text-gray-600">
          YOLO-based real-time object detection with threat analysis and security monitoring
        </p>
      </div>

      <YOLODetector />
    </main>
  )
}
