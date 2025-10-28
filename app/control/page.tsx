"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Power,
  RotateCcw,
  Camera,
  Wifi,
  Battery,
  Thermometer,
  Eye,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Lock,
  Unlock,
} from "lucide-react"

// Mock device data
const devices = [
  {
    id: "NE-01",
    name: "North Entrance Gate",
    type: "camera",
    status: "online",
    battery: 87,
    settings: {
      sensitivity: 75,
      recordingEnabled: true,
      nightVision: true,
      motionDetection: true,
      audioRecording: false,
    },
  },
  {
    id: "SE-01",
    name: "South Entrance",
    type: "camera",
    status: "warning",
    battery: 23,
    settings: {
      sensitivity: 60,
      recordingEnabled: true,
      nightVision: false,
      motionDetection: true,
      audioRecording: true,
    },
  },
  {
    id: "CT-01",
    name: "Central Tower",
    type: "camera",
    status: "online",
    battery: 95,
    settings: {
      sensitivity: 85,
      recordingEnabled: true,
      nightVision: true,
      motionDetection: true,
      audioRecording: true,
    },
  },
]

export default function ControlPage() {
  const [selectedDevice, setSelectedDevice] = useState(devices[0])
  const [isExecuting, setIsExecuting] = useState(false)
  const [lastCommand, setLastCommand] = useState<string | null>(null)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const executeCommand = async (command: string, deviceId: string) => {
    setIsExecuting(true)
    setLastCommand(`${command} on ${deviceId}`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsExecuting(false)
    setTimeout(() => setLastCommand(null), 3000)
  }

  const updateDeviceSetting = (setting: string, value: any) => {
    setSelectedDevice((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value,
      },
    }))
  }

  const handleDeviceSelection = (deviceId: string) => {
    setSelectedDevices((prev) => (prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]))
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Control Panel Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Remote Control Panel</h2>
                <p className="text-muted-foreground">Manage and configure surveillance devices remotely</p>
              </div>
              <div className="flex items-center gap-2">
                {lastCommand && (
                  <Alert className="w-auto">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Command executed: {lastCommand}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Device Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Device Selection
                  </CardTitle>
                  <CardDescription>Choose a device to control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {devices.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedDevice.id === device.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{device.name}</span>
                        {device.status === "online" ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Camera className="h-3 w-3" />
                        <span>{device.id}</span>
                        <Battery className="h-3 w-3 ml-auto" />
                        <span>{device.battery}%</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Main Control Panel */}
              <div className="lg:col-span-3 space-y-6">
                {/* Device Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        {selectedDevice.name}
                      </span>
                      <Badge
                        variant={selectedDevice.status === "online" ? "outline" : "destructive"}
                        className={selectedDevice.status === "online" ? "text-green-400 border-green-400" : ""}
                      >
                        {selectedDevice.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Device ID: {selectedDevice.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Battery: {selectedDevice.battery}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Connected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">23.4°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Motion: Clear</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Control Tabs */}
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Controls</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="recording">Recording</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  </TabsList>

                  {/* Basic Controls */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Power Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Restart", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            {isExecuting ? "Executing..." : "Restart Device"}
                          </Button>
                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Sleep Mode", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <Power className="h-4 w-4 mr-2" />
                            Sleep Mode
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full" variant="destructive">
                                <Power className="h-4 w-4 mr-2" />
                                Emergency Shutdown
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Emergency Shutdown</DialogTitle>
                                <DialogDescription>
                                  This will immediately shut down the device. Are you sure you want to continue?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => executeCommand("Emergency Shutdown", selectedDevice.id)}
                                >
                                  Confirm Shutdown
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Camera Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Start Recording", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Stop Recording", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Stop Recording
                          </Button>
                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Capture Snapshot", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Capture Snapshot
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Settings */}
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Detection Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Motion Sensitivity: {selectedDevice.settings.sensitivity}%</Label>
                            <Slider
                              value={[selectedDevice.settings.sensitivity]}
                              onValueChange={(value) => updateDeviceSetting("sensitivity", value[0])}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="motion-detection">Motion Detection</Label>
                            <Switch
                              id="motion-detection"
                              checked={selectedDevice.settings.motionDetection}
                              onCheckedChange={(checked) => updateDeviceSetting("motionDetection", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="night-vision">Night Vision</Label>
                            <Switch
                              id="night-vision"
                              checked={selectedDevice.settings.nightVision}
                              onCheckedChange={(checked) => updateDeviceSetting("nightVision", checked)}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recording Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="recording-enabled">Continuous Recording</Label>
                            <Switch
                              id="recording-enabled"
                              checked={selectedDevice.settings.recordingEnabled}
                              onCheckedChange={(checked) => updateDeviceSetting("recordingEnabled", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="audio-recording">Audio Recording</Label>
                            <Switch
                              id="audio-recording"
                              checked={selectedDevice.settings.audioRecording}
                              onCheckedChange={(checked) => updateDeviceSetting("audioRecording", checked)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="recording-quality">Recording Quality</Label>
                            <Select defaultValue="1080p">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="720p">720p HD</SelectItem>
                                <SelectItem value="1080p">1080p Full HD</SelectItem>
                                <SelectItem value="4k">4K Ultra HD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Recording Management */}
                  <TabsContent value="recording" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recording Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="bg-transparent">
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                            <Button variant="outline" className="bg-transparent">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </Button>
                            <Button variant="outline" className="bg-transparent">
                              <Square className="h-4 w-4 mr-2" />
                              Stop
                            </Button>
                            <Button variant="outline" className="bg-transparent">
                              <Camera className="h-4 w-4 mr-2" />
                              Snapshot
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Recording Duration (minutes)</Label>
                            <Input type="number" placeholder="60" min="1" max="1440" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Storage Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Storage Used</span>
                              <span>2.4 GB / 32 GB</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: "7.5%" }}></div>
                            </div>
                          </div>

                          <Button className="w-full bg-transparent" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Recordings
                          </Button>

                          <Button className="w-full bg-transparent" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Clear Storage
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Maintenance */}
                  <TabsContent value="maintenance" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">System Maintenance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Run Diagnostics", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Run Diagnostics
                          </Button>

                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Calibrate Sensors", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Calibrate Sensors
                          </Button>

                          <Button
                            className="w-full bg-transparent"
                            variant="outline"
                            onClick={() => executeCommand("Update Firmware", selectedDevice.id)}
                            disabled={isExecuting}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Update Firmware
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Security Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full bg-transparent" variant="outline">
                            <Lock className="h-4 w-4 mr-2" />
                            Lock Device
                          </Button>

                          <Button className="w-full bg-transparent" variant="outline">
                            <Unlock className="h-4 w-4 mr-2" />
                            Unlock Device
                          </Button>

                          <div className="space-y-2">
                            <Label>Change Access Code</Label>
                            <Input type="password" placeholder="Enter new code" />
                            <Button className="w-full" size="sm">
                              Update Code
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Bulk Operations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Bulk Operations
                    </CardTitle>
                    <CardDescription>Apply commands to multiple devices simultaneously</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {devices.map((device) => (
                          <label
                            key={device.id}
                            className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-accent"
                          >
                            <input
                              type="checkbox"
                              className="rounded"
                              checked={selectedDevices.includes(device.id)}
                              onChange={() => handleDeviceSelection(device.id)}
                            />
                            <span className="text-sm">{device.name}</span>
                            <Badge
                              variant="outline"
                              className={
                                device.status === "online"
                                  ? "text-green-400 border-green-400"
                                  : "text-yellow-400 border-yellow-400"
                              }
                            >
                              {device.status}
                            </Badge>
                          </label>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="bg-transparent">
                              <Power className="h-4 w-4 mr-2" />
                              Restart All
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Restart Selected Devices</DialogTitle>
                              <DialogDescription>
                                This will restart all selected devices. They will be offline for 30-60 seconds.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button onClick={() => executeCommand("Bulk Restart", selectedDevices.join(", "))}>
                                Confirm Restart
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => executeCommand("Bulk Start Recording", selectedDevices.join(", "))}
                          disabled={isExecuting}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Recording
                        </Button>

                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => executeCommand("Bulk Stop Recording", selectedDevices.join(", "))}
                          disabled={isExecuting}
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>

                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={() => executeCommand("Bulk Diagnostics", selectedDevices.join(", "))}
                          disabled={isExecuting}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Run Diagnostics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
