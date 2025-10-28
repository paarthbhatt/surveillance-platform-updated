// Database initialization and utilities
// This file provides a mock database layer for free-tier implementation
// In production, connect to Supabase or Neon using their free tier

import { decryptData } from "./encryption"

interface TrackingEvent {
  id: string
  device_id: string
  facility_id: string
  timestamp: string
  encrypted_data: { iv: string; data: string; authTag: string }
  event_type?: string
  created_at: string
}

interface Device {
  id: string
  facility_id: string
  name: string
  location: string
  api_key_hash: string
  status: "online" | "offline" | "warning"
  last_seen: string
  created_at: string
}

interface AuditLog {
  id: string
  user_id: string
  action: string
  resource: string
  status: "success" | "failure"
  timestamp: string
  ip_address: string
}

// In-memory storage for demo (replace with actual database)
const trackingEvents: TrackingEvent[] = []
const devices: Device[] = []
const auditLogs: AuditLog[] = []

export const db = {
  // Tracking Events
  insertTrackingEvent: async (event: Omit<TrackingEvent, "id" | "created_at">) => {
    const newEvent: TrackingEvent = {
      ...event,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    trackingEvents.push(newEvent)
    return newEvent
  },

  getTrackingEvents: async (facilityId: string, limit = 100) => {
    return trackingEvents
      .filter((e) => e.facility_id === facilityId)
      .slice(-limit)
      .map((e) => ({
        ...e,
        data: decryptData(e.encrypted_data),
      }))
  },

  // Devices
  insertDevice: async (device: Omit<Device, "id" | "created_at">) => {
    const newDevice: Device = {
      ...device,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    devices.push(newDevice)
    return newDevice
  },

  getDevices: async (facilityId: string) => {
    return devices.filter((d) => d.facility_id === facilityId)
  },

  updateDeviceStatus: async (deviceId: string, status: "online" | "offline" | "warning") => {
    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      device.status = status
      device.last_seen = new Date().toISOString()
    }
    return device
  },

  // Audit Logs
  insertAuditLog: async (log: Omit<AuditLog, "id">) => {
    const newLog: AuditLog = {
      ...log,
      id: crypto.randomUUID(),
    }
    auditLogs.push(newLog)
    return newLog
  },

  getAuditLogs: async (userId: string, limit = 100) => {
    return auditLogs.filter((l) => l.user_id === userId).slice(-limit)
  },
}

export type { TrackingEvent, Device, AuditLog }
