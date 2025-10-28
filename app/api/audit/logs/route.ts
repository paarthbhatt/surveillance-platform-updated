import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id")
    const limit = Number.parseInt(req.nextUrl.searchParams.get("limit") || "100")

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    const logs = await db.getAuditLogs(userId, limit)

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs,
    })
  } catch (error) {
    console.error("[v0] Get audit logs error:", error)
    return NextResponse.json({ error: "Failed to retrieve audit logs" }, { status: 500 })
  }
}
