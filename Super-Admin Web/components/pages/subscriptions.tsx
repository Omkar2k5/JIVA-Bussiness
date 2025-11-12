"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api-client"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("plans")
  const [showNewPlanForm, setShowNewPlanForm] = useState(false)
  const [newPlan, setNewPlan] = useState({ name: "", price: "", duration: "", features: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const plansData = await adminApi.getSubscriptionPlans()
      const subsData = await adminApi.getSubscriptions()
      if (plansData.success) setPlans(plansData.plans)
      if (subsData.success) setSubscriptions(subsData.subscriptions)
    } catch (err) {
      console.error("Failed to fetch data:", err)
      // Use mock data as fallback
      setPlans([
        {
          id: "1",
          name: "Free",
          price: 0,
          duration: "monthly",
          features: ["Basic features", "5 projects", "Community support"],
        },
        {
          id: "2",
          name: "Premium",
          price: 29.99,
          duration: "monthly",
          features: ["All Free features", "Unlimited projects", "Priority support", "Advanced analytics"],
        },
        {
          id: "3",
          name: "Enterprise",
          price: 99.99,
          duration: "monthly",
          features: ["All Premium features", "Custom integrations", "Dedicated support", "SLA guarantee"],
        },
      ])
      setSubscriptions([
        {
          id: "1",
          userName: "John Doe",
          planName: "Premium",
          status: "active",
          startDate: "2024-01-15",
          expiryDate: "2025-01-15",
        },
        {
          id: "2",
          userName: "Jane Smith",
          planName: "Enterprise",
          status: "active",
          startDate: "2024-02-20",
          expiryDate: "2025-02-20",
        },
        {
          id: "3",
          userName: "Sarah Williams",
          planName: "Premium",
          status: "active",
          startDate: "2024-04-05",
          expiryDate: "2025-04-05",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await adminApi.createPlan({
        ...newPlan,
        price: Number.parseFloat(newPlan.price),
        features: newPlan.features.split(",").map((f) => f.trim()),
      })
      setNewPlan({ name: "", price: "", duration: "", features: "" })
      setShowNewPlanForm(false)
      fetchData()
    } catch (err) {
      console.error("Failed to create plan:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions & Billing</h1>
        <p className="text-muted-foreground mt-2">Manage plans and user subscriptions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "plans"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Plans
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "subscriptions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          User Subscriptions
        </button>
      </div>

      {activeTab === "plans" && (
        <div className="space-y-4">
          <Button onClick={() => setShowNewPlanForm(!showNewPlanForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Plan
          </Button>

          {showNewPlanForm && (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Plan Name (e.g., Premium)"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Price ($)"
                      type="number"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Duration (e.g., monthly)"
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Features (comma-separated)"
                    value={newPlan.features}
                    onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Create Plan</Button>
                    <Button type="button" variant="outline" onClick={() => setShowNewPlanForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan: any) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    ${plan.price}/{plan.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Features:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {plan.features?.map((feature: string, idx: number) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "subscriptions" && (
        <Card>
          <CardHeader>
            <CardTitle>All User Subscriptions</CardTitle>
            <CardDescription>Total: {subscriptions.length} active subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading subscriptions...</div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No subscriptions found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Start Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub: any) => (
                      <tr key={sub.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">{sub.userName}</td>
                        <td className="py-3 px-4">{sub.planName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              sub.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Date(sub.expiryDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
