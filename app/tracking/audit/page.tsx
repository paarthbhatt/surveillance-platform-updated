"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Shield } from "lucide-react"

interface AuditEntry {
  id: string
  timestamp: string
  action: string
  resource: string
  status: "success" | "failure"
  ip_address: string
  details: string
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate audit logs
    const mockLogs: AuditEntry[] = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        action: "tracking_data_received",
        resource: "device:device-1",
        status: "success",
        ip_address: "192.168.1.100",
        details: "Encrypted tracking data received and stored",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        action: "device_registered",
        resource: "device:device-2",
        status: "success",
        ip_address: "192.168.1.101",
        details: "New surveillance device registered",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        action: "data_accessed",
        resource: "tracking_events",
        status: "success",
        ip_address: "192.168.1.50",
        details: "User accessed tracking events with proper authorization",
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
        action: "unauthorized_access",
        resource: "audit_logs",
        status: "failure",
        ip_address: "203.0.113.45",
        details: "Unauthorized access attempt blocked",
      },
      {
        id: "5",
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        action: "encryption_key_rotated",
        resource: "system:encryption",
        status: "success",
        ip_address: "192.168.1.50",
        details: "Encryption keys rotated successfully",
      },
    ]

    setAuditLogs(mockLogs)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading audit logs...</p>
          </main>
        </div>
      </div>
    )
  }

  const successCount = auditLogs.filter((log) => log.status === "success").length
  const failureCount = auditLogs.filter((log) => log.status === "failure").length

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Audit Logs</h2>
              <p className="text-muted-foreground">Complete audit trail of all system activities and security events</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-cyan-400" />
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">{auditLogs.length}</div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Successful
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{successCount}</div>
                </CardContent>
              </Card>

              <Card className="border-red-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{failureCount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Log Entries */}
            <Card className="border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  Activity Log
                </CardTitle>
                <CardDescription>Recent system activities and security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 bg-slate-800 rounded border border-slate-700 hover:border-cyan-500/50 transition"
                    >
                      <div className="mt-1">
                        {log.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">{log.action}</p>
                          <Badge
                            variant="outline"
                            className={
                              log.status === "success"
                                ? "text-green-400 border-green-500/50"
                                : "text-red-400 border-red-500/50"
                            }
                          >
                            {log.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{log.details}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Resource: {log.resource}</span>
                          <span>IP: {log.ip_address}</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Recommendations */}
            <Card className="border-orange-500/20 bg-gradient-to-br from-orange-950/20 to-transparent">
              <CardHeader>
                <CardTitle className="text-orange-400">Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-foreground">• Rotate encryption keys every 90 days for enhanced security</p>
                <p className="text-sm text-foreground">
                  • Review failed access attempts regularly for potential threats
                </p>
                <p className="text-sm text-foreground">• Maintain audit logs for at least 1 year for compliance</p>
                <p className="text-sm text-foreground">• Enable multi-factor authentication for all user accounts</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
