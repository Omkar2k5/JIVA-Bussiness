"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthUser, removeAuthToken } from "@/lib/auth"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import DevBanner from "@/components/dev-banner"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
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

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DevBanner />
        <Navbar user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
