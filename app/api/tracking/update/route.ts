import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    // Verify API key from edge device
    const apiKey = req.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 })
    }

    const payload = await req.json()
    const { device_id, facility_id, encrypted_data, timestamp } = payload

    if (!device_id || !facility_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log audit event
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    await db.insertAuditLog({
      user_id: device_id,
      action: "tracking_data_received",
      resource: `device:${device_id}`,
      status: "success",
      ip_address: clientIp,
      timestamp: new Date().toISOString(),
    })

    // Store encrypted tracking data
    const trackingEvent = await db.insertTrackingEvent({
      device_id,
      facility_id,
      timestamp: timestamp || new Date().toISOString(),
      encrypted_data,
      event_type: "object_detection",
    })

    // Update device status to online
    await db.updateDeviceStatus(device_id, "online")

    return NextResponse.json({
      success: true,
      event_id: trackingEvent.id,
      message: "Tracking data received and encrypted",
    })
  } catch (error) {
    console.error("[v0] Tracking update error:", error)
    return NextResponse.json({ error: "Failed to process tracking data" }, { status: 500 })
  }
}
