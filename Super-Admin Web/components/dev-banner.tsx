"use client"

import { AlertCircle } from "lucide-react"

export default function DevBanner() {
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
