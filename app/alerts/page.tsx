"use client"

import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Archive,
  Trash2,
  Eye,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const alerts = [
  {
    id: "ALT-001",
    type: "critical",
    title: "Camera Offline",
    description: "Camera CAM-004 (West Corridor) has gone offline",
    timestamp: "2 minutes ago",
    status: "active",
    location: "West Wing",
    device: "CAM-004",
  },
  {
    id: "ALT-002",
    type: "warning",
    title: "Low Battery",
    description: "Unit SW-02 battery level below 20%",
    timestamp: "5 minutes ago",
    status: "active",
    location: "South Wing",
    device: "SW-02",
  },
  {
    id: "ALT-003",
    type: "info",
    title: "Motion Detected",
    description: "Unusual motion pattern detected at North Gate",
    timestamp: "8 minutes ago",
    status: "acknowledged",
    location: "North Perimeter",
    device: "CAM-001",
  },
  {
    id: "ALT-004",
    type: "warning",
    title: "High Temperature",
    description: "Server room temperature above threshold (28°C)",
    timestamp: "12 minutes ago",
    status: "active",
    location: "Basement",
    device: "TEMP-001",
  },
  {
    id: "ALT-005",
    type: "critical",
    title: "Network Connectivity",
    description: "Lost connection to East Wing surveillance units",
    timestamp: "15 minutes ago",
    status: "resolved",
    location: "East Wing",
    device: "NET-003",
  },
  {
    id: "ALT-006",
    type: "info",
    title: "Scheduled Maintenance",
    description: "Camera CAM-007 maintenance window starting",
    timestamp: "18 minutes ago",
    status: "acknowledged",
    location: "Rooftop",
    device: "CAM-007",
  },
]

const alertStats = [
  { name: "Critical", value: 2, color: "#ef4444" },
  { name: "Warning", value: 3, color: "#f59e0b" },
  { name: "Info", value: 4, color: "#3b82f6" },
]

const alertTrends = [
  { time: "00:00", critical: 0, warning: 1, info: 2 },
  { time: "04:00", critical: 1, warning: 2, info: 1 },
  { time: "08:00", critical: 0, warning: 3, info: 3 },
  { time: "12:00", critical: 2, warning: 1, info: 2 },
  { time: "16:00", critical: 1, warning: 2, info: 4 },
  { time: "20:00", critical: 2, warning: 3, info: 1 },
]

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "info":
        return <Bell className="h-4 w-4 text-info" />
      default:
        return <Bell className="h-4 w-4 text-info" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-destructive border-destructive bg-destructive/10"
      case "warning":
        return "text-warning border-warning bg-warning/10"
      case "info":
        return "text-info border-info bg-info/10"
      default:
        return "text-info border-info bg-info/10"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity className="h-3 w-3 text-destructive" />
      case "acknowledged":
        return <Eye className="h-3 w-3 text-warning" />
      case "resolved":
        return <CheckCircle className="h-3 w-3 text-success" />
      default:
        return <Activity className="h-3 w-3 text-destructive" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-destructive border-destructive"
      case "acknowledged":
        return "text-warning border-warning"
      case "resolved":
        return "text-success border-success"
      default:
        return "text-destructive border-destructive"
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
              <h2 className="text-3xl font-bold text-foreground">Alert Management</h2>
              <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
            </div>

            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Alerts</p>
                      <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                    </div>
                    <Bell className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <p className="text-2xl font-bold text-destructive">
                        {alerts.filter((a) => a.type === "critical").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold text-warning">
                        {alerts.filter((a) => a.status === "active").length}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold text-success">
                        {alerts.filter((a) => a.status === "resolved").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alert Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Alert Distribution
                  </CardTitle>
                  <CardDescription>Current alerts by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={alertStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {alertStats.map((entry, index) => (
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
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {alertStats.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alert Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Alert Trends (24h)
                  </CardTitle>
                  <CardDescription>Alert frequency over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={alertTrends}>
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
                      <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                      <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
                      <Bar dataKey="info" stackId="a" fill="#3b82f6" name="Info" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Alerts List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Alerts
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive All
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 hover:bg-accent/50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{alert.title}</h3>
                              <Badge variant="outline" className={getStatusColor(alert.status)}>
                                {getStatusIcon(alert.status)}
                                <span className="ml-1 capitalize">{alert.status}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {alert.timestamp}
                              </span>
                              <span>{alert.location}</span>
                              <span>{alert.device}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Archive className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
