"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Square, RefreshCw, Eye, Download, AlertTriangle } from "lucide-react"

interface DetectedObject {
  id: number
  class: string
  bbox: [number, number, number, number]
  confidence: number
  centroid: [number, number]
}

interface TrackingData {
  timestamp: string
  device_id: string
  objects: DetectedObject[]
}

export default function TrackingPage() {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState("device-1")
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)

  const facilityId = "facility-1"

  // Check simulator status on mount
  useEffect(() => {
    checkSimulatorStatus()
  }, [selectedDevice])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [pollInterval])

  // Check if simulator is running
  const checkSimulatorStatus = async () => {
    try {
      const response = await fetch(`/api/simulator/status?device_id=${selectedDevice}`)
      const data = await response.json()
      if (data.success) {
        setIsSimulating(data.is_running)
      }
    } catch (err) {
      console.error("[v0] Status check error:", err)
    }
  }

  // Fetch tracking events
  const fetchTrackingData = async () => {
    try {
      const response = await fetch(`/api/tracking/events?facility_id=${facilityId}&limit=50`)
      const data = await response.json()

      if (data.success) {
        setTrackingData(data.events || [])
      }
    } catch (err) {
      console.error("[v0] Fetch error:", err)
      setError("Failed to fetch tracking data")
    }
  }

  // Start simulator
  const startSimulator = async () => {
    try {
      setLoading(true)
      setError("")

      // First, register device if needed
      const registerResponse = await fetch("/api/devices/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_id: facilityId,
          device_name: selectedDevice,
          location: "Main Entrance",
          device_type: "camera",
        }),
      })

      const registerData = await registerResponse.json()

      if (!registerData.success) {
        throw new Error("Failed to register device")
      }

      const deviceApiKey = registerData.api_key
      setApiKey(deviceApiKey)

      // Start simulator
      const response = await fetch("/api/simulator/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: selectedDevice,
          facility_id: facilityId,
          api_key: deviceApiKey,
          interval_ms: 2000,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSimulating(true)

        // Start polling for data
        if (pollInterval) {
          clearInterval(pollInterval)
        }

        const newPollInterval = setInterval(() => {
          fetchTrackingData()
        }, 3000)

        setPollInterval(newPollInterval)

        // Fetch initial data
        fetchTrackingData()
      } else {
        setError(data.error || "Failed to start simulator")
      }
    } catch (err) {
      console.error("[v0] Start simulator error:", err)
      setError(err instanceof Error ? err.message : "Failed to start simulator")
    } finally {
      setLoading(false)
    }
  }

  // Stop simulator
  const stopSimulator = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/simulator/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: selectedDevice }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSimulating(false)

        // Stop polling
        if (pollInterval) {
          clearInterval(pollInterval)
          setPollInterval(null)
        }
      } else {
        setError(data.message || "Failed to stop simulator")
      }
    } catch (err) {
      console.error("[v0] Stop simulator error:", err)
      setError(err instanceof Error ? err.message : "Failed to stop simulator")
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const stats = {
    totalEvents: trackingData.length,
    totalObjects: trackingData.reduce((sum, event) => sum + event.objects.length, 0),
    personCount: trackingData.reduce(
      (sum, event) => sum + event.objects.filter((obj) => obj.class === "person").length,
      0,
    ),
    vehicleCount: trackingData.reduce(
      (sum, event) => sum + event.objects.filter((obj) => obj.class === "vehicle").length,
      0,
    ),
  }

  // Get latest frame
  const latestFrame = trackingData[trackingData.length - 1]

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Real-Time Object Tracking</h2>
              <p className="text-muted-foreground">
                Monitor detected objects and personnel movement in real-time with encrypted data transmission
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Control Panel */}
            <Card className="border-cyan-500/20 bg-gradient-to-br from-slate-900 to-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-cyan-400" />
                  Simulator Control
                </CardTitle>
                <CardDescription>Start/stop edge device simulation and data collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground mb-2 block">Device ID</label>
                    <input
                      type="text"
                      value={selectedDevice}
                      onChange={(e) => setSelectedDevice(e.target.value)}
                      disabled={isSimulating}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-foreground disabled:opacity-50"
                      placeholder="device-1"
                    />
                  </div>
                  <Button
                    onClick={startSimulator}
                    disabled={isSimulating || loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {loading ? "Starting..." : "Start"}
                  </Button>
                  <Button
                    onClick={stopSimulator}
                    disabled={!isSimulating || loading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    {loading ? "Stopping..." : "Stop"}
                  </Button>
                  <Button onClick={fetchTrackingData} disabled={loading} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {isSimulating && (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-sm">Simulator running - collecting encrypted tracking data</span>
                  </div>
                )}

                {apiKey && (
                  <div className="bg-slate-700 p-3 rounded text-xs font-mono text-cyan-300 break-all">
                    API Key: {apiKey.substring(0, 16)}...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">{stats.totalEvents}</div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Objects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{stats.totalObjects}</div>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Persons Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">{stats.personCount}</div>
                </CardContent>
              </Card>

              <Card className="border-magenta-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Vehicles Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-400">{stats.vehicleCount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Frame Visualization */}
            {latestFrame && (
              <Card className="border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-cyan-400" />
                    Latest Detection Frame
                  </CardTitle>
                  <CardDescription>
                    {latestFrame.timestamp} - {latestFrame.objects.length} objects detected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                    {latestFrame.objects.length > 0 ? (
                      latestFrame.objects.map((obj) => (
                        <div
                          key={obj.id}
                          className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700 hover:border-cyan-500/50 transition"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Badge
                              className={`${
                                obj.class === "person"
                                  ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                                  : "bg-pink-500/20 text-pink-400 border-pink-500/50"
                              }`}
                              variant="outline"
                            >
                              {obj.class}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">Object ID: {obj.id}</p>
                              <p className="text-xs text-muted-foreground">
                                Position: ({Math.round(obj.centroid[0])}, {Math.round(obj.centroid[1])})
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-cyan-400">{(obj.confidence * 100).toFixed(1)}%</p>
                            <p className="text-xs text-muted-foreground">confidence</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No objects detected in latest frame</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Events */}
            <Card className="border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-cyan-400" />
                  Recent Tracking Events
                </CardTitle>
                <CardDescription>Last 10 detection frames with encrypted data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {trackingData
                    .slice(-10)
                    .reverse()
                    .map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700 hover:border-cyan-500/50 transition"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{event.timestamp}</p>
                          <p className="text-xs text-muted-foreground">Device: {event.device_id}</p>
                        </div>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-500/50">
                          {event.objects.length} objects
                        </Badge>
                      </div>
                    ))}
                  {trackingData.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No tracking events yet. Start the simulator to begin.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
