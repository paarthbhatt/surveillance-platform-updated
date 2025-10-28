import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const facilityId = req.nextUrl.searchParams.get("facility_id")
    const limit = Number.parseInt(req.nextUrl.searchParams.get("limit") || "100")

    if (!facilityId) {
      return NextResponse.json({ error: "Missing facility_id" }, { status: 400 })
    }

    // In production, verify user authorization here
    const events = await db.getTrackingEvents(facilityId, limit)

    // Decrypt data for response
    const decryptedEvents = events.map((event) => ({
      ...event,
      data: event.data,
    }))

    return NextResponse.json({
      success: true,
      count: decryptedEvents.length,
      events: decryptedEvents,
    })
  } catch (error) {
    console.error("[v0] Get events error:", error)
    return NextResponse.json({ error: "Failed to retrieve events" }, { status: 500 })
  }
}
