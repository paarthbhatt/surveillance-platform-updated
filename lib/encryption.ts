import crypto from "crypto"

// Generate a 32-byte encryption key (use environment variable in production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex")

export function encryptData(data: any): { iv: string; data: string; authTag: string } {
  try {
    const iv = crypto.randomBytes(16)
    const key =
      Buffer.from(ENCRYPTION_KEY, "hex").length === 32
        ? Buffer.from(ENCRYPTION_KEY, "hex")
        : crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    return {
      iv: iv.toString("hex"),
      data: encrypted,
      authTag: authTag.toString("hex"),
    }
  } catch (error) {
    console.error("[v0] Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

export function decryptData(encrypted: { iv: string; data: string; authTag: string }): any {
  try {
    const key =
      Buffer.from(ENCRYPTION_KEY, "hex").length === 32
        ? Buffer.from(ENCRYPTION_KEY, "hex")
        : crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(encrypted.iv, "hex"))

    decipher.setAuthTag(Buffer.from(encrypted.authTag, "hex"))

    let decrypted = decipher.update(encrypted.data, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return JSON.parse(decrypted)
  } catch (error) {
    console.error("[v0] Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex")
}
