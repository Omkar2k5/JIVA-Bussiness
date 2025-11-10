"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api-client"
import { Download, BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const [reports, setReports] = useState({
    totalRevenue: 0,
    newUsers: 0,
    churnRate: 0,
    avgRevenuePerUser: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getReports("summary")
      if (data.success) {
        setReports(data.reports)
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: string) => {
    try {
      const blob = await adminApi.exportData("all", format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `admin-report.${format}`
      a.click()
    } catch (err) {
      console.error("Failed to export:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">View and export comprehensive analytics data</p>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download reports in your preferred format</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={() => handleExport("csv")} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={() => handleExport("pdf")} className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {loading ? (
        <div className="text-center py-12">Loading reports...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReportCard icon={BarChart3} label="Total Revenue" value={`$${reports.totalRevenue.toLocaleString()}`} />
          <ReportCard icon={BarChart3} label="New Users (30d)" value={reports.newUsers} />
          <ReportCard icon={BarChart3} label="Churn Rate" value={`${reports.churnRate}%`} />
          <ReportCard icon={BarChart3} label="Avg Revenue/User" value={`$${reports.avgRevenuePerUser}`} />
        </div>
      )}

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Analytics</CardTitle>
          <CardDescription>Plan-wise usage and conversion metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Free Plan Users</p>
                <p className="text-2xl font-bold mt-2">2,450</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Premium Plan Users</p>
                <p className="text-2xl font-bold mt-2">1,230</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Enterprise Plan Users</p>
                <p className="text-2xl font-bold mt-2">450</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportCard({ icon: Icon, label, value }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
