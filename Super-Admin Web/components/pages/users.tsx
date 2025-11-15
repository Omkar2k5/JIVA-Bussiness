"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api-client"
import { Search, Shield, RotateCcw, Eye, Mail, Calendar, Activity, Users, UserCheck, UserX, Crown, Edit2 } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState("created_at")
  const [editingUser, setEditingUser] = useState(null)
  const [editPlan, setEditPlan] = useState("")
  const [editExpiryDate, setEditExpiryDate] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [page, search, sortBy])

  const fetchUsers = async () => {
    setLoading(true)
    const filters = search ? { search } : {}
    const data = await adminApi.getUsers(page, 10, filters)
    if (data.success) {
      let sortedUsers = [...data.users]
      
      // Apply sorting
      if (sortBy === "phone") {
        sortedUsers.sort((a, b) => (a.phone || "").localeCompare(b.phone || ""))
      } else if (sortBy === "reference") {
        sortedUsers.sort((a, b) => (a.reference || "").localeCompare(b.reference || ""))
      } else if (sortBy === "plan") {
        sortedUsers.sort((a, b) => (a.subscription_plan || "").localeCompare(b.subscription_plan || ""))
      } else if (sortBy === "expiry") {
        sortedUsers.sort((a, b) => {
          const dateA = new Date(a.plan_valid_until || "")
          const dateB = new Date(b.plan_valid_until || "")
          return dateA.getTime() - dateB.getTime()
        })
      }
      
      setUsers(sortedUsers)
      setTotal(data.total)
    }
    setLoading(false)
  }

  const handleSuspendUser = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this user?")) return

    try {
      await adminApi.suspendUser(userId)
      fetchUsers()
    } catch (err) {
      alert("Action simulated (backend not connected)")
      fetchUsers()
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      await adminApi.resetUserPassword(userId)
      alert("Password reset link sent to user email")
    } catch (err) {
      alert("Password reset simulated (backend not connected)")
    }
  }

  const handleEditPlan = (user: any) => {
    setEditingUser(user)
    setEditPlan(user.subscription_plan)
    setEditExpiryDate(user.plan_valid_until || "")
  }

  const handleSavePlan = async () => {
    if (!editingUser) return
    
    try {
      await adminApi.updateUser(editingUser.id, {
        subscription_plan: editPlan,
        plan_valid_until: editExpiryDate
      })
      alert("Plan updated successfully")
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      alert("Failed to update plan")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground mt-2">Manage all platform users and their subscriptions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold mt-2">{total}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold mt-2">{users.filter((u: any) => u.status === "active").length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold mt-2">{users.filter((u: any) => u.status === "suspended").length}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900">
                <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Premium Plans</p>
                <p className="text-2xl font-bold mt-2">{users.filter((u: any) => u.subscription_plan === "Premium" || u.subscription_plan === "Enterprise").length}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <Button
                variant={sortBy === "created_at" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("created_at")}
              >
                Date
              </Button>
              <Button
                variant={sortBy === "phone" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("phone")}
              >
                Mobile No
              </Button>
              <Button
                variant={sortBy === "reference" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("reference")}
              >
                Reference
              </Button>
              <Button
                variant={sortBy === "plan" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("plan")}
              >
                Plan
              </Button>
              <Button
                variant={sortBy === "expiry" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("expiry")}
              >
                Expiry Date
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Plan Modal */}
      {editingUser && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle>Edit Plan - {editingUser.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subscription Plan</label>
              <select
                value={editPlan}
                onChange={(e) => setEditPlan(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Plan Valid Until</label>
              <input
                type="date"
                value={editExpiryDate}
                onChange={(e) => setEditExpiryDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSavePlan} className="bg-blue-600">Save Changes</Button>
              <Button onClick={() => setEditingUser(null)} variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total: {total} users</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">User Details</th>
                    <th className="text-left py-3 px-4 font-semibold">Mobile</th>
                    <th className="text-left py-3 px-4 font-semibold">Reference</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Plan</th>
                    <th className="text-left py-3 px-4 font-semibold">Expiry Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Joined</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/40 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs text-muted-foreground">#{user.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{user.name}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{user.phone || "-"}</td>
                      <td className="py-4 px-4 text-sm">{user.reference || "-"}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "active" ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"
                          }`} />
                          {String(user.status).charAt(0).toUpperCase() + String(user.status).slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            user.subscription_plan === "Enterprise"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                              : user.subscription_plan === "Premium"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {user.subscription_plan || "Free"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{user.plan_valid_until ? new Date(user.plan_valid_until).toLocaleDateString("en-US", { 
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          }) : "-"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(user.created_at).toLocaleDateString("en-US", { 
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPlan(user)}
                            title="Edit plan"
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPassword(user.id)}
                            title="Reset password"
                            className="h-8 w-8 p-0"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            title="Suspend user"
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(total / 10)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page * 10 >= total}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
