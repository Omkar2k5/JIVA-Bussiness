"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import LoginPage from "@/components/auth/login-page"
import { getAuthToken } from "@/lib/auth"

export default function RootPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      setIsAuthenticated(true)
      router.push("/admin/dashboard")
    } else {
      setIsAuthenticated(false)
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return isAuthenticated ? <AdminLayout /> : <LoginPage />
}
