"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Bell, Lock, Users } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appName: "Jiva Business",
    maxFreeUsers: 5000,
    notificationEmail: "admin@jiva.com",
    defaultPlanLimit: 1000,
  })

  const handleSave = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground mt-2">Configure global application settings</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            General Settings
          </CardTitle>
          <CardDescription>Application-wide configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Application Name</label>
            <Input
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Max Free Tier Users</label>
              <Input
                type="number"
                value={settings.maxFreeUsers}
                onChange={(e) => setSettings({ ...settings, maxFreeUsers: Number.parseInt(e.target.value) })}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Default Plan Message Limit</label>
              <Input
                type="number"
                value={settings.defaultPlanLimit}
                onChange={(e) => setSettings({ ...settings, defaultPlanLimit: Number.parseInt(e.target.value) })}
                className="mt-2"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure alert preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Notification Email</label>
            <Input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              className="mt-2"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">User signup alerts</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Subscription expiry alerts</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Payment failure alerts</span>
            </label>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Admin Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Admin Management (Future)
          </CardTitle>
          <CardDescription>Multi-admin support with role hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This feature will allow you to add sub-admins and assign granular permissions for multi-admin support.
          </p>
        </CardContent>
      </Card>

      {/* WebSocket Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Analytics (Future)</CardTitle>
          <CardDescription>WebSocket-based live dashboard coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Enable real-time analytics with WebSocket connections for live user activity, subscription updates, and
            revenue tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
