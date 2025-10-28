import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashApiKey, generateApiKey } from "@/lib/encryption"

export async function POST(req: NextRequest) {
  try {
    const { facility_id, device_name, location, device_type } = await req.json()

    if (!facility_id || !device_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate API key for device
    const apiKey = generateApiKey()
    const apiKeyHash = hashApiKey(apiKey)

    // Register device
    const device = await db.insertDevice({
      facility_id,
      name: device_name,
      location: location || "Unknown",
      api_key_hash: apiKeyHash,
      status: "offline",
      last_seen: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      device_id: device.id,
      api_key: apiKey,
      message: "Device registered successfully. Store the API key securely.",
    })
  } catch (error) {
    console.error("[v0] Device registration error:", error)
    return NextResponse.json({ error: "Failed to register device" }, { status: 500 })
  }
}
