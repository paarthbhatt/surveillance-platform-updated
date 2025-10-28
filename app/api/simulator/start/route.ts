import { type NextRequest, NextResponse } from "next/server"
import { EdgeDeviceSimulator, sendTrackingDataToBackend } from "@/lib/edge-device-simulator"
import { SimulatorStateManager } from "@/lib/simulator-state"

export async function POST(req: NextRequest) {
  try {
    const { device_id, facility_id, api_key, interval_ms = 2000 } = await req.json()

    if (!device_id || !facility_id || !api_key) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const stateManager = SimulatorStateManager.getInstance()

    // Stop existing simulator if running
    if (stateManager.isRunning(device_id)) {
      stateManager.stopSimulator(device_id)
    }

    // Create simulator
    const simulator = new EdgeDeviceSimulator(device_id, facility_id)

    // Start sending data at regular intervals
    const intervalId = setInterval(async () => {
      try {
        const frame = simulator.generateFrame()
        const encryptedData = simulator.encryptFrame(frame)

        await sendTrackingDataToBackend(frame, encryptedData, api_key)
      } catch (error) {
        console.error("[v0] Simulator error:", error)
      }
    }, interval_ms)

    stateManager.startSimulator(device_id, intervalId)

    return NextResponse.json({
      success: true,
      message: `Simulator started for device ${device_id}`,
      interval_ms,
    })
  } catch (error) {
    console.error("[v0] Start simulator error:", error)
    return NextResponse.json({ error: "Failed to start simulator" }, { status: 500 })
  }
}
