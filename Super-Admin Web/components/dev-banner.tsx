"use client"

import { AlertCircle, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function DevBanner() {
  const [backendConnected, setBackendConnected] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:3001/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        setBackendConnected(response.ok)
      } catch (error) {
        setBackendConnected(false)
      }
      setChecked(true)
    }

    checkBackend()
  }, [])

  if (!checked) {
    return null
  }

  if (backendConnected) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
        <div className="px-4 py-2 flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200">
            <strong>Production Mode:</strong> Connected to backend - Using real data from database
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="px-4 py-2 flex items-center gap-2 text-sm">
        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-yellow-800 dark:text-yellow-200">
          <strong>Development Mode:</strong> Using mock data (backend not connected)
        </span>
      </div>
    </div>
  )
}
