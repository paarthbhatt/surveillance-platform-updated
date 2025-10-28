import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const facilityId = req.nextUrl.searchParams.get("facility_id")

    if (!facilityId) {
      return NextResponse.json({ error: "Missing facility_id" }, { status: 400 })
    }

    const devices = await db.getDevices(facilityId)

    const statusSummary = {
      total: devices.length,
      online: devices.filter((d) => d.status === "online").length,
      offline: devices.filter((d) => d.status === "offline").length,
      warning: devices.filter((d) => d.status === "warning").length,
      devices,
    }

    return NextResponse.json({
      success: true,
      ...statusSummary,
    })
  } catch (error) {
    console.error("[v0] Get device status error:", error)
    return NextResponse.json({ error: "Failed to retrieve device status" }, { status: 500 })
  }
}
