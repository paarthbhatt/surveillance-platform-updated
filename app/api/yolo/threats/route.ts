import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { encryptData } from "@/lib/encryption"

export async function POST(req: NextRequest) {
  try {
    const { threats, deviceId, facilityId } = await req.json()

    if (!threats || !deviceId || !facilityId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store threats in database
    const storedThreats = []
    for (const threat of threats) {
      const encryptedThreat = encryptData(threat)

      const stored = await db.insertTrackingEvent({
        device_id: deviceId,
        facility_id: facilityId,
        timestamp: threat.timestamp,
        encrypted_data: encryptedThreat,
        event_type: "threat_detected",
      })

      storedThreats.push(stored)

      // Log audit event
      await db.insertAuditLog({
        user_id: deviceId,
        action: "threat_detected",
        resource: `threat:${threat.type}`,
        status: "success",
        ip_address: req.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      threatsStored: storedThreats.length,
      message: `${storedThreats.length} threats logged and encrypted`,
    })
  } catch (error) {
    console.error("[v0] Threat storage error:", error)
    return NextResponse.json({ error: "Failed to store threats" }, { status: 500 })
  }
}
