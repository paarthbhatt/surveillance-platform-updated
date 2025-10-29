"use client"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Settings,
  ChevronDown,
  Wifi,
  Battery,
  Sun,
  Moon,
  Monitor,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: "warning", message: "Low battery on Unit SW-02", time: "2 min ago" },
    { id: 2, type: "info", message: "Motion detected at North Gate", time: "5 min ago" },
    { id: 3, type: "success", message: "Camera NE-04 came online", time: "8 min ago" },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile navigation trigger */}
        <MobileNav />
        <h1 className="text-2xl font-semibold text-foreground">Surveillance Monitoring</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-success border-success">
            <Wifi className="h-3 w-3 mr-1" />
            Online
          </Badge>
          <Badge variant="outline" className="text-info border-info">
            <Battery className="h-3 w-3 mr-1" />
            87%
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Sun className="h-4 w-4 mr-2" />
              Production
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Production</DropdownMenuItem>
            <DropdownMenuItem>Staging</DropdownMenuItem>
            <DropdownMenuItem>Development</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Last 12 hours
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Last hour</DropdownMenuItem>
            <DropdownMenuItem>Last 6 hours</DropdownMenuItem>
            <DropdownMenuItem>Last 12 hours</DropdownMenuItem>
            <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
            <DropdownMenuItem>Last 7 days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {theme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="h-4 w-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                {notifications.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <div className="p-2">
              <h3 className="font-semibold mb-2">Recent Notifications</h3>
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-2 p-2 hover:bg-accent rounded-md">
                  {notification.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />}
                  {notification.type === "success" && <CheckCircle className="h-4 w-4 text-success mt-0.5" />}
                  {notification.type === "info" && <Bell className="h-4 w-4 text-info mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>User Preferences</DropdownMenuItem>
            <DropdownMenuItem>System Settings</DropdownMenuItem>
            <DropdownMenuItem>Device Configuration</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
