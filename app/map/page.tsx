"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Search,
  Filter,
  Camera,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Eye,
  Thermometer,
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  Power,
} from "lucide-react"

// Format number: 2 decimal places for decimals, keep integers as-is
const formatNumber = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return value.toFixed(2)
}

// Mock surveillance units data
const surveillanceUnits = [
  {
    id: "NE-01",
    name: "North Entrance Gate",
    position: { x: 75, y: 20 },
    status: "online",
    type: "camera",
    alerts: 0,
    battery: 87,
    lastSeen: "2 min ago",
    sensors: ["PIR", "Camera", "DHT11"],
  },
  {
    id: "NE-02",
    name: "North Perimeter East",
    position: { x: 85, y: 25 },
    status: "online",
    type: "sensor",
    alerts: 0,
    battery: 92,
    lastSeen: "1 min ago",
    sensors: ["PIR", "LDR", "DHT11"],
  },
  {
    id: "SE-01",
    name: "South Entrance",
    position: { x: 70, y: 80 },
    status: "warning",
    type: "camera",
    alerts: 1,
    battery: 23,
    lastSeen: "5 min ago",
    sensors: ["PIR", "Camera"],
  },
  {
    id: "SW-01",
    name: "Southwest Corner",
    position: { x: 15, y: 75 },
    status: "offline",
    type: "sensor",
    alerts: 2,
    battery: 0,
    lastSeen: "2 hours ago",
    sensors: ["PIR", "LDR"],
  },
  {
    id: "EW-01",
    name: "East Wing Corridor",
    position: { x: 90, y: 45 },
    status: "online",
    type: "camera",
    alerts: 0,
    battery: 78,
    lastSeen: "30 sec ago",
    sensors: ["PIR", "Camera", "DHT11"],
  },
  {
    id: "WP-01",
    name: "West Parking Lot",
    position: { x: 25, y: 35 },
    status: "online",
    type: "sensor",
    alerts: 0,
    battery: 65,
    lastSeen: "1 min ago",
    sensors: ["PIR", "LDR"],
  },
  {
    id: "CT-01",
    name: "Central Tower",
    position: { x: 50, y: 50 },
    status: "online",
    type: "camera",
    alerts: 0,
    battery: 95,
    lastSeen: "15 sec ago",
    sensors: ["PIR", "Camera", "DHT11", "LDR"],
  },
  {
    id: "NW-01",
    name: "Northwest Perimeter",
    position: { x: 20, y: 20 },
    status: "warning",
    type: "sensor",
    alerts: 1,
    battery: 34,
    lastSeen: "3 min ago",
    sensors: ["PIR", "DHT11"],
  },
]

export default function MapPage() {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUnits = surveillanceUnits.filter((unit) => {
    const matchesSearch =
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || unit.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 border-green-400"
      case "warning":
        return "text-yellow-400 border-yellow-400"
      case "offline":
        return "text-red-400 border-red-400"
      default:
        return "text-gray-400 border-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const selectedUnitData = selectedUnit ? surveillanceUnits.find((u) => u.id === selectedUnit) : null

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Map Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Interactive Map</h2>
                <p className="text-muted-foreground">Geographic view of surveillance units and their status</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interactive Map */}
              <div className="lg:col-span-2">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Facility Overview
                    </CardTitle>
                    <CardDescription>Click on any unit to view detailed information</CardDescription>
                  </CardHeader>
                  <CardContent className="h-full p-0">
                    <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
                      {/* Map Background Grid */}
                      <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%">
                          <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>

                      {/* Building Outline */}
                      <div className="absolute inset-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                        <div className="absolute top-4 left-4 text-xs text-muted-foreground">North</div>
                        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">South</div>
                        <div className="absolute top-4 right-4 text-xs text-muted-foreground">East</div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                          Main Building
                        </div>
                      </div>

                      {/* Surveillance Units */}
                      {filteredUnits.map((unit) => (
                        <button
                          key={unit.id}
                          onClick={() => setSelectedUnit(unit.id)}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 transition-all hover:scale-110 ${
                            selectedUnit === unit.id ? "scale-125 ring-2 ring-primary" : ""
                          } ${
                            unit.status === "online"
                              ? "bg-green-400/20 border-green-400 hover:bg-green-400/30"
                              : unit.status === "warning"
                                ? "bg-yellow-400/20 border-yellow-400 hover:bg-yellow-400/30"
                                : "bg-red-400/20 border-red-400 hover:bg-red-400/30"
                          }`}
                          style={{
                            left: `${unit.position.x}%`,
                            top: `${unit.position.y}%`,
                          }}
                        >
                          {unit.type === "camera" ? <Camera className="h-4 w-4" /> : <Activity className="h-4 w-4" />}

                          {/* Unit Label */}
                          <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-card px-2 py-1 rounded border border-border shadow-sm">
                            {unit.id}
                          </div>

                          {/* Alert Indicator */}
                          {unit.alerts > 0 && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">{unit.alerts}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Unit Details Panel */}
              <div className="space-y-4">
                {selectedUnitData ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{selectedUnitData.name}</span>
                          {getStatusIcon(selectedUnitData.status)}
                        </CardTitle>
                        <CardDescription>Unit ID: {selectedUnitData.id}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status</span>
                          <Badge variant="outline" className={getStatusColor(selectedUnitData.status)}>
                            {selectedUnitData.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Battery Level</span>
                          <div className="flex items-center gap-2">
                            <Zap
                              className={`h-4 w-4 ${selectedUnitData.battery > 50 ? "text-green-400" : selectedUnitData.battery > 20 ? "text-yellow-400" : "text-red-400"}`}
                            />
                            <span className="text-sm font-medium">{formatNumber(selectedUnitData.battery)}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Last Seen</span>
                          <span className="text-sm text-muted-foreground">{selectedUnitData.lastSeen}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Connection</span>
                          {selectedUnitData.status === "offline" ? (
                            <WifiOff className="h-4 w-4 text-red-400" />
                          ) : (
                            <Wifi className="h-4 w-4 text-green-400" />
                          )}
                        </div>

                        {selectedUnitData.alerts > 0 && (
                          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <span className="text-sm font-medium text-destructive">
                                {selectedUnitData.alerts} Active Alert{selectedUnitData.alerts > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Sensors</CardTitle>
                        <CardDescription>Available sensor modules</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedUnitData.sensors.map((sensor) => (
                            <Badge key={sensor} variant="outline" className="justify-center">
                              {sensor === "PIR" && <Eye className="h-3 w-3 mr-1" />}
                              {sensor === "Camera" && <Camera className="h-3 w-3 mr-1" />}
                              {sensor === "DHT11" && <Thermometer className="h-3 w-3 mr-1" />}
                              {sensor === "LDR" && <Activity className="h-3 w-3 mr-1" />}
                              {sensor}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button
                          className="w-full bg-transparent"
                          variant="outline"
                          onClick={() => {
                            if (selectedUnitData?.type === "camera") {
                              alert(`Opening live feed for ${selectedUnitData.name}`)
                            } else {
                              alert(`Viewing sensor data for ${selectedUnitData?.name}`)
                            }
                          }}
                        >
                          {selectedUnitData?.type === "camera" ? (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              View Live Feed
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              View Sensor Data
                            </>
                          )}
                        </Button>
                        <Button
                          className="w-full bg-transparent"
                          variant="outline"
                          onClick={() => {
                            alert(`Downloading logs for ${selectedUnitData?.name}`)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Logs
                        </Button>
                        <Button
                          className="w-full bg-transparent"
                          variant="outline"
                          onClick={() => {
                            if (confirm(`Are you sure you want to restart ${selectedUnitData?.name}?`)) {
                              alert(`Restarting ${selectedUnitData?.name}...`)
                            }
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Restart Unit
                        </Button>
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `EMERGENCY SHUTDOWN: This will immediately shut down ${selectedUnitData?.name}. Are you sure?`,
                              )
                            ) {
                              alert(`Emergency shutdown initiated for ${selectedUnitData?.name}`)
                            }
                          }}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          Emergency Shutdown
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center space-y-2">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Select a unit on the map to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Online Units</p>
                    <p className="text-2xl font-bold text-green-400">
                      {surveillanceUnits.filter((u) => u.status === "online").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Warning Units</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {surveillanceUnits.filter((u) => u.status === "warning").length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Offline Units</p>
                    <p className="text-2xl font-bold text-red-400">
                      {surveillanceUnits.filter((u) => u.status === "offline").length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Alerts</p>
                    <p className="text-2xl font-bold text-destructive">
                      {surveillanceUnits.reduce((sum, u) => sum + u.alerts, 0)}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
