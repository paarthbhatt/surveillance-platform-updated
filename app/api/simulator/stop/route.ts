import { type NextRequest, NextResponse } from "next/server"
import { SimulatorStateManager } from "@/lib/simulator-state"

export async function POST(req: NextRequest) {
  try {
    const { device_id } = await req.json()

    if (!device_id) {
      return NextResponse.json({ error: "Missing device_id" }, { status: 400 })
    }

    const stateManager = SimulatorStateManager.getInstance()

    if (stateManager.stopSimulator(device_id)) {
      return NextResponse.json({
        success: true,
        message: `Simulator stopped for device ${device_id}`,
      })
    }

    return NextResponse.json({
      success: false,
      message: `No active simulator for device ${device_id}`,
    })
  } catch (error) {
    console.error("[v0] Stop simulator error:", error)
    return NextResponse.json({ error: "Failed to stop simulator" }, { status: 500 })
  }
}
