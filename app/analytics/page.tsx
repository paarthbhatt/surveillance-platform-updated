"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Eye,
  Zap,
  Thermometer,
  Activity,
  MapPin,
} from "lucide-react"
import { addDays } from "date-fns"

// Mock historical data
const energyTrends = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  solar: 15 + Math.random() * 25 + Math.sin(i / 5) * 10,
  battery: 60 + Math.random() * 30,
  consumption: 8 + Math.random() * 12,
}))

const motionPatterns = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  weekday: Math.floor(Math.random() * 50) + 10,
  weekend: Math.floor(Math.random() * 30) + 5,
  alerts: Math.floor(Math.random() * 8),
}))

const temperatureHistory = Array.from({ length: 168 }, (_, i) => ({
  time: `${Math.floor(i / 7)}d ${i % 24}h`,
  temperature: 20 + Math.sin(i / 12) * 8 + Math.random() * 4,
  humidity: 45 + Math.cos(i / 8) * 15 + Math.random() * 10,
}))

const deviceUptime = [
  { name: "North Sector", uptime: 98.5, downtime: 1.5 },
  { name: "South Sector", uptime: 94.2, downtime: 5.8 },
  { name: "East Wing", uptime: 99.1, downtime: 0.9 },
  { name: "West Parking", uptime: 87.3, downtime: 12.7 },
]

const alertDistribution = [
  { name: "Low Battery", value: 45, color: "#f59e0b" },
  { name: "Connection Lost", value: 30, color: "#ef4444" },
  { name: "Motion Detected", value: 15, color: "#3b82f6" },
  { name: "Temperature Alert", value: 10, color: "#8b5cf6" },
]

const correlationData = Array.from({ length: 50 }, (_, i) => ({
  temperature: 15 + Math.random() * 20,
  motionEvents: Math.floor(Math.random() * 30),
  batteryLevel: 20 + Math.random() * 80,
}))

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("energy")
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 30),
  })

  const downloadFile = (filename: string, content: string, type = "text/plain") => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const rows: string[] = []
    rows.push("Section,Key,Value")
    energyTrends.forEach((d) => rows.push(`Energy Trends,${d.date},solar:${d.solar.toFixed(2)}|battery:${d.battery.toFixed(2)}|consumption:${d.consumption.toFixed(2)}`))
    motionPatterns.forEach((d) => rows.push(`Motion Patterns,${d.hour},weekday:${d.weekday}|weekend:${d.weekend}|alerts:${d.alerts}`))
    temperatureHistory.slice(-48).forEach((d) => rows.push(`Env,${d.time},temperature:${d.temperature.toFixed(2)}|humidity:${d.humidity.toFixed(2)}`))
    deviceUptime.forEach((d) => rows.push(`Uptime,${d.name},uptime:${d.uptime}|downtime:${d.downtime}`))
    alertDistribution.forEach((d) => rows.push(`Alerts,${d.name},value:${d.value}`))
    downloadFile("analytics-export.csv", rows.join("\n"), "text/csv;charset=utf-8")
  }

  const generateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      dateRange,
      summaries: {
        avgSolar: Number(
          (
            energyTrends.reduce((s, d) => s + d.solar, 0) / energyTrends.length
          ).toFixed(2),
        ),
        totalMotionWeekday: motionPatterns.reduce((s, d) => s + d.weekday, 0),
        totalMotionWeekend: motionPatterns.reduce((s, d) => s + d.weekend, 0),
        avgTemp: Number(
          (
            temperatureHistory.slice(-48).reduce((s, d) => s + d.temperature, 0) / 48
          ).toFixed(2),
        ),
        uptimeLeaders: deviceUptime
          .slice()
          .sort((a, b) => b.uptime - a.uptime)
          .slice(0, 2),
      },
    }
    downloadFile("analytics-report.json", JSON.stringify(report, null, 2), "application/json")
  }

  const scheduleReport = () => {
    // Demo: generate a report after 3 seconds
    setTimeout(() => generateReport(), 3000)
    alert("Report scheduled. A report will be generated in 3 seconds (demo)")
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Analytics Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Historical Data Analysis</h2>
                <p className="text-muted-foreground">Analyze trends, patterns, and insights from surveillance data</p>
              </div>
              <div className="flex items-center gap-2">
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 bg-transparent" onClick={exportCSV}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Energy Generation</p>
                      <p className="text-2xl font-bold text-foreground">24.7W</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">+12.3%</span>
                      </div>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Motion Events</p>
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-3 w-3 text-red-400" />
                        <span className="text-xs text-red-400">-5.2%</span>
                      </div>
                    </div>
                    <Eye className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Temperature</p>
                      <p className="text-2xl font-bold text-foreground">23.4°C</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">+2.1°C</span>
                      </div>
                    </div>
                    <Thermometer className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">System Uptime</p>
                      <p className="text-2xl font-bold text-foreground">94.8%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">+1.2%</span>
                      </div>
                    </div>
                    <Activity className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Energy Generation Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Energy Generation Over Time
                  </CardTitle>
                  <CardDescription>Solar generation, battery levels, and consumption patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={energyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--card-foreground))",
                          }}
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
                        <Area
                          type="monotone"
                          dataKey="consumption"
                          stackId="3"
                          stroke="var(--chart-3)"
                          fill="var(--chart-3)"
                          fillOpacity={0.6}
                          strokeWidth={3}
                          name="Consumption"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Motion Detection Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Motion Detection Patterns
                  </CardTitle>
                  <CardDescription>Hourly motion events comparison: weekdays vs weekends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={motionPatterns}>
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
                        />
                        <Bar dataKey="weekday" fill="var(--chart-2)" name="Weekdays" strokeWidth={2} />
                        <Bar dataKey="weekend" fill="var(--chart-1)" name="Weekends" strokeWidth={2} />
                        <Bar dataKey="alerts" fill="var(--chart-5)" name="Alerts" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Environmental Data & Device Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Temperature & Humidity Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Environmental Conditions
                  </CardTitle>
                  <CardDescription>Temperature and humidity trends over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={temperatureHistory.slice(-48)}>
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
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="var(--chart-3)"
                          strokeWidth={4}
                          dot={{ fill: "var(--chart-3)", strokeWidth: 2, r: 4 }}
                          name="Temperature (°C)"
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          stroke="var(--chart-1)"
                          strokeWidth={4}
                          dot={{ fill: "var(--chart-1)", strokeWidth: 2, r: 4 }}
                          name="Humidity (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Alert Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Alert Distribution
                  </CardTitle>
                  <CardDescription>Types of alerts in the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={alertDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {alertDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {alertDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Performance & Correlation Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Uptime Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Device Uptime by Location
                  </CardTitle>
                  <CardDescription>System availability across different sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceUptime.map((device) => (
                      <div key={device.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{device.name}</span>
                          <span className="text-sm text-muted-foreground">{device.uptime}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{ width: `${device.uptime}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Performance Insights</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• East Wing shows highest reliability (99.1%)</li>
                      <li>• West Parking needs attention (87.3% uptime)</li>
                      <li>• Average system uptime: 94.8%</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Correlation Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Temperature vs Motion Correlation
                  </CardTitle>
                  <CardDescription>Relationship between environmental factors and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          type="number"
                          dataKey="temperature"
                          name="Temperature"
                          unit="°C"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis
                          type="number"
                          dataKey="motionEvents"
                          name="Motion Events"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--card-foreground))",
                          }}
                        />
                        <Scatter
                          dataKey="motionEvents"
                          fill="var(--chart-2)"
                          stroke="var(--chart-2)"
                          strokeWidth={2}
                          r={6}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Correlation Insights</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Moderate positive correlation (r = 0.34)</li>
                      <li>• Higher temperatures correlate with increased activity</li>
                      <li>• Peak activity occurs at 22-26°C range</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Data Export & Reports</CardTitle>
                <CardDescription>Generate custom reports and export historical data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={exportCSV}>
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Export CSV</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={generateReport}>
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={scheduleReport}>
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Schedule Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
