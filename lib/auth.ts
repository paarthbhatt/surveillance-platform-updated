// Authentication and authorization utilities
import { hashApiKey } from "./encryption"

interface User {
  id: string
  email: string
  facility_id: string
  role: "admin" | "operator" | "viewer"
}

// Mock user database
const users: Map<string, User> = new Map([
  [
    "user-1",
    {
      id: "user-1",
      email: "admin@surveillance.local",
      facility_id: "facility-1",
      role: "admin",
    },
  ],
])

export function verifyApiKey(apiKey: string, expectedHash: string): boolean {
  const hash = hashApiKey(apiKey)
  return hash === expectedHash
}

export function getUserById(userId: string): User | undefined {
  return users.get(userId)
}

export function canAccessFacility(user: User, facilityId: string): boolean {
  return user.facility_id === facilityId
}

export function canPerformAction(user: User, action: string): boolean {
  const permissions: Record<string, string[]> = {
    admin: ["read", "write", "delete", "manage_devices", "view_audit"],
    operator: ["read", "write", "manage_devices"],
    viewer: ["read"],
  }

  return permissions[user.role]?.includes(action) ?? false
}
