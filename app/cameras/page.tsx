"use client"

import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  Play,
  Settings,
  Download,
  Maximize,
  Search,
  Filter,
  Grid3X3,
  List,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const cameras = [
  {
    id: "CAM-001",
    name: "North Gate",
    location: "North Perimeter",
    status: "online",
    resolution: "1080p",
    fps: 30,
    recording: true,
    imageUrl: "/security-camera-view-of-north-gate-entrance-with-p.jpg",
  },
  {
    id: "CAM-002",
    name: "South Entrance",
    location: "South Wing",
    status: "online",
    resolution: "4K",
    fps: 60,
    recording: true,
    imageUrl: "/security-camera-view-of-south-building-entrance-wi.jpg",
  },
  {
    id: "CAM-003",
    name: "East Parking",
    location: "East Wing",
    status: "warning",
    resolution: "1080p",
    fps: 30,
    recording: false,
    imageUrl: "/security-camera-view-of-east-parking-lot-with-cars.jpg",
  },
  {
    id: "CAM-004",
    name: "West Corridor",
    location: "West Wing",
    status: "offline",
    resolution: "720p",
    fps: 30,
    recording: false,
    imageUrl: "/security-camera-view-of-west-corridor-hallway-with.jpg",
  },
  {
    id: "CAM-005",
    name: "Main Lobby",
    location: "Central",
    status: "online",
    resolution: "4K",
    fps: 30,
    recording: true,
    imageUrl: "/security-camera-view-of-main-lobby-with-reception-.jpg",
  },
  {
    id: "CAM-006",
    name: "Server Room",
    location: "Basement",
    status: "online",
    resolution: "1080p",
    fps: 60,
    recording: true,
    imageUrl: "/security-camera-view-of-server-room-with-computer-.jpg",
  },
  {
    id: "CAM-007",
    name: "Rooftop",
    location: "Building Top",
    status: "online",
    resolution: "4K",
    fps: 30,
    recording: true,
    imageUrl: "/security-camera-view-of-rooftop-with-hvac-equipmen.jpg",
  },
  {
    id: "CAM-008",
    name: "Loading Dock",
    location: "Rear",
    status: "warning",
    resolution: "1080p",
    fps: 30,
    recording: true,
    imageUrl: "/security-camera-view-of-loading-dock-with-trucks-a.jpg",
  },
]

export default function CamerasPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeCamera, setActiveCamera] = useState<typeof cameras[0] | null>(null)

  const filteredCameras = cameras.filter((camera) => {
    const matchesSearch =
      camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || camera.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "offline":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <CheckCircle className="h-4 w-4 text-success" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-success border-success"
      case "warning":
        return "text-warning border-warning"
      case "offline":
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Camera Management</h2>
                <p className="text-muted-foreground">Monitor and manage all surveillance cameras</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cameras</p>
                      <p className="text-2xl font-bold text-foreground">{cameras.length}</p>
                    </div>
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Online</p>
                      <p className="text-2xl font-bold text-success">
                        {cameras.filter((c) => c.status === "online").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Recording</p>
                      <p className="text-2xl font-bold text-info">{cameras.filter((c) => c.recording).length}</p>
                    </div>
                    <Play className="h-8 w-8 text-info" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Issues</p>
                      <p className="text-2xl font-bold text-warning">
                        {cameras.filter((c) => c.status !== "online").length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cameras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Camera Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCameras.map((camera) => (
                  <Card key={camera.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img
                        src={camera.imageUrl || "/placeholder.svg"}
                        alt={`${camera.name} camera view`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className={getStatusColor(camera.status)}>
                          {getStatusIcon(camera.status)}
                          <span className="ml-1 capitalize">{camera.status}</span>
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        {camera.recording && (
                          <Badge variant="destructive" className="animate-pulse">
                            ● REC
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-white text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        LIVE
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{camera.name}</h3>
                          <p className="text-sm text-muted-foreground">{camera.location}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{camera.resolution}</span>
                          <span>{camera.fps} FPS</span>
                        </div>
                        <div className="flex items-center gap-1 pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => setActiveCamera(camera)}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{activeCamera?.name} – Live View</DialogTitle>
                              </DialogHeader>
                              <div className="aspect-video bg-black rounded overflow-hidden">
                                <img src={activeCamera?.imageUrl || "/placeholder.svg"} alt="Live" className="w-full h-full object-cover" />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline" onClick={() => setActiveCamera(camera)}>
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const csv = `id,name,location\\n${camera.id},${camera.name},${camera.location}`
                              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `${camera.id}-recordings.csv`
                              document.body.appendChild(a)
                              a.click()
                              a.remove()
                              URL.revokeObjectURL(url)
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {filteredCameras.map((camera) => (
                      <div key={camera.id} className="p-4 flex items-center justify-between hover:bg-accent/50">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                            <img
                              src={camera.imageUrl || "/placeholder.svg"}
                              alt={`${camera.name} thumbnail`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{camera.name}</h3>
                            <p className="text-sm text-muted-foreground">{camera.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-foreground">
                              {camera.resolution} • {camera.fps} FPS
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getStatusColor(camera.status)}>
                                {getStatusIcon(camera.status)}
                                <span className="ml-1 capitalize">{camera.status}</span>
                              </Badge>
                              {camera.recording && (
                                <Badge variant="destructive" className="animate-pulse">
                                  ● REC
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setActiveCamera(camera)}>
                                  <Play className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>{activeCamera?.name} – Live View</DialogTitle>
                                </DialogHeader>
                                <div className="aspect-video bg-black rounded overflow-hidden">
                                  <img src={activeCamera?.imageUrl || "/placeholder.svg"} alt="Live" className="w-full h-full object-cover" />
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline" onClick={() => setActiveCamera(camera)}>
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const csv = `id,name,location\\n${camera.id},${camera.name},${camera.location}`
                                const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement("a")
                                a.href = url
                                a.download = `${camera.id}-recordings.csv`
                                document.body.appendChild(a)
                                a.click()
                                a.remove()
                                URL.revokeObjectURL(url)
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                window.open(camera.imageUrl || "/placeholder.svg", "_blank")
                              }}
                            >
                              <Maximize className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
