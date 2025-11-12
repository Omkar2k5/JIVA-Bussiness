"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "@/components/auth/login-page"
import { getAuthToken } from "@/lib/auth"

export default function RootPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for token after component mounts (client-side only)
    const checkAuth = () => {
      try {
        const token = getAuthToken()
        if (token) {
          router.push("/admin/dashboard")
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    // Small delay to ensure localStorage is accessible
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <LoginPage />
}
