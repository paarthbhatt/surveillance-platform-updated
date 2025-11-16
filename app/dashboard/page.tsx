"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  Activity,
  Thermometer,
  Droplets,
  Eye,
  Zap,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Battery,
  Sun,
  Moon,
} from "lucide-react"

// Mock real-time data
const generateSensorData = () => ({
  timestamp: new Date().toLocaleTimeString(),
  temperature: 22 + Math.random() * 8,
  humidity: 45 + Math.random() * 20,
  light: Math.random() * 100,
  motion: Math.random() > 0.8,
  battery: 75 + Math.random() * 25,
  solar: Math.random() * 50,
})

const motionHistory = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  events: Math.floor(Math.random() * 20),
  alerts: Math.floor(Math.random() * 5),
}))

const energyData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  solar: 20 + Math.random() * 30,
  battery: 60 + Math.random() * 30,
  consumption: 10 + Math.random() * 15,
}))

// Format number: 2 decimal places for decimals, keep integers as-is
const formatNumber = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString()
  }
  return value.toFixed(2)
}

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState(generateSensorData())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setSensorData(generateSensorData())
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Live Dashboard</h2>
                <p className="text-muted-foreground">Real-time surveillance data and system metrics</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={isLive ? "default" : "outline"} onClick={() => setIsLive(!isLive)} className="gap-2">
                  <Activity className={`h-4 w-4 ${isLive ? "animate-pulse" : ""}`} />
                  {isLive ? "Live" : "Paused"}
                </Button>
              </div>
            </div>

            {/* Real-time Sensor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{formatNumber(sensorData.temperature)}°C</div>
                  <Progress value={sensorData.temperature * 3} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">DHT11 Sensor - {sensorData.timestamp}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{formatNumber(sensorData.humidity)}%</div>
                  <Progress value={sensorData.humidity} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">DHT11 Sensor - {sensorData.timestamp}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Light Level</CardTitle>
                  {sensorData.light > 50 ? (
                    <Sun className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-blue-400" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{formatNumber(sensorData.light)}%</div>
                  <Progress value={sensorData.light} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">LDR Sensor - {sensorData.timestamp}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Motion Status</CardTitle>
                  <Eye className={`h-4 w-4 ${sensorData.motion ? "text-red-400" : "text-green-400"}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{sensorData.motion ? "DETECTED" : "CLEAR"}</div>
                  <Badge
                    variant={sensorData.motion ? "destructive" : "outline"}
                    className={`mt-2 ${sensorData.motion ? "" : "text-green-400 border-green-400"}`}
                  >
                    PIR Sensor
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Last update: {sensorData.timestamp}</p>
                </CardContent>
              </Card>
            </div>

            {/* Energy Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Energy Metrics
                  </CardTitle>
                  <CardDescription>Solar charging and battery levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Battery Level</span>
                      </div>
                      <span className="text-sm font-medium">{formatNumber(sensorData.battery)}%</span>
                    </div>
                    <Progress value={sensorData.battery} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">Solar Generation</span>
                      </div>
                      <span className="text-sm font-medium">{formatNumber(sensorData.solar)}W</span>
                    </div>
                    <Progress value={sensorData.solar * 2} className="h-2" />
                  </div>

                  <div className="mt-6 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--card-foreground))",
                          }}
                          formatter={(value: number) => formatNumber(value)}
                        />
                        <Area
                          type="monotone"
                          dataKey="solar"
                          stackId="1"
                          stroke="var(--chart-4)"
                          fill="var(--chart-4)"
                          fillOpacity={0.6}
                          strokeWidth={3}
                          name="Solar Generation"
                        />
                        <Area
                          type="monotone"
                          dataKey="battery"
                          stackId="2"
                          stroke="var(--chart-1)"
                          fill="var(--chart-1)"
                          fillOpacity={0.6}
                          strokeWidth={3}
                          name="Battery Level"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Motion Detection
                  </CardTitle>
                  <CardDescription>24-hour motion events and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={motionHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--card-foreground))",
                          }}
                          formatter={(value: number) => formatNumber(value)}
                        />
                        <Bar
                          dataKey="events"
                          fill="var(--chart-2)"
                          name="Motion Events"
                          strokeWidth={2}
                          stroke="var(--chart-2)"
                        />
                        <Bar
                          dataKey="alerts"
                          fill="var(--chart-5)"
                          name="Alerts"
                          strokeWidth={2}
                          stroke="var(--chart-5)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Status Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Device Status Overview</CardTitle>
                <CardDescription>Real-time status of all surveillance units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }, (_, i) => {
                    const isOnline = Math.random() > 0.1
                    const hasAlert = Math.random() > 0.8
                    return (
                      <div key={i} className="p-4 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">Unit {String(i + 1).padStart(2, "0")}</span>
                          <div className="flex items-center gap-1">
                            {isOnline ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                            )}
                            <Wifi className={`h-3 w-3 ${isOnline ? "text-green-400" : "text-red-400"}`} />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Location: {["North", "South", "East", "West"][i % 4]} Sector
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="h-3 w-3" />
                          <Progress value={60 + Math.random() * 40} className="h-1 flex-1" />
                          <span className="text-xs">{formatNumber(60 + Math.random() * 40)}%</span>
                        </div>
                        {hasAlert && (
                          <Badge variant="destructive" className="text-xs">
                            Low Battery
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
