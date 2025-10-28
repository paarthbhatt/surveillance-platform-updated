"use client"

import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Battery, Sun, TrendingUp, TrendingDown, Activity, Gauge, Leaf, AlertTriangle } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const energyData = [
  { time: "00:00", solar: 0, battery: 85, consumption: 12 },
  { time: "04:00", solar: 0, battery: 78, consumption: 10 },
  { time: "08:00", solar: 15, battery: 82, consumption: 18 },
  { time: "12:00", solar: 45, battery: 95, consumption: 25 },
  { time: "16:00", solar: 38, battery: 92, consumption: 22 },
  { time: "20:00", solar: 8, battery: 87, consumption: 15 },
]

const deviceConsumption = [
  { name: "Cameras", value: 45, color: "#3b82f6" },
  { name: "Sensors", value: 25, color: "#10b981" },
  { name: "Processing", value: 20, color: "#f59e0b" },
  { name: "Network", value: 10, color: "#ef4444" },
]

const batteryLevels = [
  { unit: "Unit-01", level: 95, status: "excellent" },
  { unit: "Unit-02", level: 87, status: "good" },
  { unit: "Unit-03", level: 72, status: "fair" },
  { unit: "Unit-04", level: 45, status: "low" },
  { unit: "Unit-05", level: 91, status: "excellent" },
  { unit: "Unit-06", level: 68, status: "fair" },
]

export default function EnergyPage() {
  const totalGeneration = 156.8
  const totalConsumption = 142.3
  const efficiency = 89.2
  const carbonSaved = 2.4

  const getBatteryColor = (level: number) => {
    if (level >= 80) return "text-success"
    if (level >= 50) return "text-warning"
    return "text-destructive"
  }

  const getBatteryStatus = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-success border-success"
      case "good":
        return "text-info border-info"
      case "fair":
        return "text-warning border-warning"
      case "low":
        return "text-destructive border-destructive"
      default:
        return "text-success border-success"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Energy Management</h2>
              <p className="text-muted-foreground">Monitor solar generation, battery levels, and power consumption</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Solar Generation</p>
                      <p className="text-2xl font-bold text-foreground">{totalGeneration} kWh</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">+12% today</span>
                      </div>
                    </div>
                    <Sun className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Power Consumption</p>
                      <p className="text-2xl font-bold text-foreground">{totalConsumption} kWh</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">-5% today</span>
                      </div>
                    </div>
                    <Zap className="h-8 w-8 text-info" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">System Efficiency</p>
                      <p className="text-2xl font-bold text-foreground">{efficiency}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">Optimal</span>
                      </div>
                    </div>
                    <Gauge className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Carbon Saved</p>
                      <p className="text-2xl font-bold text-foreground">{carbonSaved} kg</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Leaf className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">Today</span>
                      </div>
                    </div>
                    <Leaf className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Energy Generation & Consumption */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Energy Flow (24h)
                  </CardTitle>
                  <CardDescription>Solar generation vs power consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="solar"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.6}
                        name="Solar (kW)"
                      />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        stackId="2"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="Consumption (kW)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Power Consumption Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Power Distribution
                  </CardTitle>
                  <CardDescription>Current power consumption by component</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={deviceConsumption}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {deviceConsumption.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {deviceConsumption.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-foreground">{item.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Battery Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  Battery Status
                </CardTitle>
                <CardDescription>Current battery levels across all surveillance units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batteryLevels.map((battery, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{battery.unit}</h3>
                        <Badge variant="outline" className={getBatteryStatus(battery.status)}>
                          {battery.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Battery Level</span>
                          <span className={`text-sm font-medium ${getBatteryColor(battery.level)}`}>
                            {battery.level}%
                          </span>
                        </div>
                        <Progress value={battery.level} className="h-2" />
                        {battery.level < 50 && (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs">Low battery warning</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Battery Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Battery Trends (24h)
                </CardTitle>
                <CardDescription>Average battery levels over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="time" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="battery"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      name="Battery Level (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
