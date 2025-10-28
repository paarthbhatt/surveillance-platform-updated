"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Activity, AlertTriangle, Clock } from "lucide-react"

interface TrackingAnalytics {
  totalEvents: number
  totalObjects: number
  personCount: number
  vehicleCount: number
  averageConfidence: number
  peakHour: string
  eventsByHour: Array<{ hour: string; count: number }>
  objectDistribution: Array<{ name: string; value: number }>
}

export default function TrackingAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TrackingAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate analytics data
    const mockAnalytics: TrackingAnalytics = {
      totalEvents: 1247,
      totalObjects: 3891,
      personCount: 2156,
      vehicleCount: 1735,
      averageConfidence: 0.92,
      peakHour: "14:00",
      eventsByHour: [
        { hour: "00:00", count: 45 },
        { hour: "04:00", count: 32 },
        { hour: "08:00", count: 89 },
        { hour: "12:00", count: 156 },
        { hour: "14:00", count: 234 },
        { hour: "16:00", count: 198 },
        { hour: "20:00", count: 112 },
        { hour: "23:00", count: 67 },
      ],
      objectDistribution: [
        { name: "Person", value: 2156 },
        { name: "Vehicle", value: 1735 },
      ],
    }

    setAnalytics(mockAnalytics)
    setLoading(false)
  }, [])

  if (loading || !analytics) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading analytics...</p>
          </main>
        </div>
      </div>
    )
  }

  const COLORS = ["#ff6b35", "#ff0080"]

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Tracking Analytics</h2>
              <p className="text-muted-foreground">Comprehensive analysis of object detection and movement patterns</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">{analytics.totalEvents}</div>
                  <p className="text-xs text-muted-foreground mt-1">Detection frames processed</p>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Total Objects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{analytics.totalObjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">Unique detections</p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    Avg Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">
                    {(analytics.averageConfidence * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Detection accuracy</p>
                </CardContent>
              </Card>

              <Card className="border-magenta-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-pink-400" />
                    Peak Hour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-400">{analytics.peakHour}</div>
                  <p className="text-xs text-muted-foreground mt-1">Highest activity</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Events by Hour */}
              <Card className="border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Detection Events by Hour</CardTitle>
                  <CardDescription>Hourly distribution of tracking events</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.eventsByHour}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                      <XAxis dataKey="hour" stroke="rgba(148, 163, 184, 0.5)" />
                      <YAxis stroke="rgba(148, 163, 184, 0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid rgba(0, 212, 255, 0.3)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#00d4ff" }}
                      />
                      <Bar dataKey="count" fill="#00d4ff" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Object Distribution */}
              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">Object Type Distribution</CardTitle>
                  <CardDescription>Breakdown of detected object types</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.objectDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.objectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid rgba(0, 212, 255, 0.3)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#00d4ff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detection Summary */}
            <Card className="border-cyan-500/20">
              <CardHeader>
                <CardTitle>Detection Summary</CardTitle>
                <CardDescription>Overview of tracked objects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800 rounded border border-slate-700">
                    <p className="text-sm text-muted-foreground mb-2">Persons Detected</p>
                    <p className="text-3xl font-bold text-orange-400">{analytics.personCount}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {((analytics.personCount / analytics.totalObjects) * 100).toFixed(1)}% of total
                    </p>
                  </div>

                  <div className="p-4 bg-slate-800 rounded border border-slate-700">
                    <p className="text-sm text-muted-foreground mb-2">Vehicles Detected</p>
                    <p className="text-3xl font-bold text-pink-400">{analytics.vehicleCount}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {((analytics.vehicleCount / analytics.totalObjects) * 100).toFixed(1)}% of total
                    </p>
                  </div>

                  <div className="p-4 bg-slate-800 rounded border border-slate-700">
                    <p className="text-sm text-muted-foreground mb-2">Avg Objects/Event</p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {(analytics.totalObjects / analytics.totalEvents).toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Objects per detection frame</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
