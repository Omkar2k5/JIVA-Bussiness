"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAuthUser, removeAuthToken } from "@/lib/auth"
import Sidebar from "./sidebar"
import Navbar from "./navbar"
import Dashboard from "./pages/dashboard"
import UsersPage from "./pages/users"
import SubscriptionsPage from "./pages/subscriptions"
import ReportsPage from "./pages/reports"
import SettingsPage from "./pages/settings"

export default function AdminLayout() {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const authUser = getAuthUser()
    if (!authUser) {
      router.push("/")
    } else {
      setUser(authUser)
    }
  }, [router])

  const handleLogout = () => {
    removeAuthToken()
    router.push("/")
  }

  const getPageContent = () => {
    const page = pathname.split("/").pop()
    switch (page) {
      case "users":
        return <UsersPage />
      case "subscriptions":
        return <SubscriptionsPage />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <Dashboard />
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{getPageContent()}</div>
        </main>
      </div>
    </div>
  )
}
