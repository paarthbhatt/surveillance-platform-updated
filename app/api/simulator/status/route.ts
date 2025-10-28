import { type NextRequest, NextResponse } from "next/server"
import { SimulatorStateManager } from "@/lib/simulator-state"

export async function GET(req: NextRequest) {
  try {
    const deviceId = req.nextUrl.searchParams.get("device_id")

    if (!deviceId) {
      return NextResponse.json({ error: "Missing device_id" }, { status: 400 })
    }

    const stateManager = SimulatorStateManager.getInstance()
    const isRunning = stateManager.isRunning(deviceId)

    return NextResponse.json({
      success: true,
      device_id: deviceId,
      is_running: isRunning,
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
  }
}
