"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api-client"
import { Search, Shield, RotateCcw, Eye, Mail, Calendar, Activity, Users, UserCheck, UserX, Crown } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const filters = search ? { search } : {}
      const data = await adminApi.getUsers(page, 10, filters)
      if (data.success) {
        setUsers(data.users)
        setTotal(data.total)
      }
    } catch (err) {
      console.error("Failed to fetch users:", err)
      // Use mock data as fallback
      const mockUsers = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          status: "active",
          plan: "Premium",
          createdAt: "2024-01-15T10:30:00Z",
          lastActive: "2024-11-10T15:20:00Z",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          status: "active",
          plan: "Enterprise",
          createdAt: "2024-02-20T08:15:00Z",
          lastActive: "2024-11-11T09:45:00Z",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.j@example.com",
          status: "suspended",
          plan: "Free",
          createdAt: "2024-03-10T14:22:00Z",
          lastActive: "2024-10-15T12:30:00Z",
        },
        {
          id: "4",
          name: "Sarah Williams",
          email: "sarah.w@example.com",
          status: "active",
          plan: "Premium",
          createdAt: "2024-04-05T11:45:00Z",
          lastActive: "2024-11-12T08:00:00Z",
        },
        {
          id: "5",
          name: "David Brown",
          email: "d.brown@example.com",
          status: "active",
          plan: "Free",
          createdAt: "2024-05-12T16:30:00Z",
          lastActive: "2024-11-11T18:22:00Z",
        },
        {
          id: "6",
          name: "Emma Davis",
          email: "emma.davis@example.com",
          status: "active",
          plan: "Enterprise",
          createdAt: "2024-06-08T09:10:00Z",
          lastActive: "2024-11-12T07:15:00Z",
        },
        {
          id: "7",
          name: "Robert Miller",
          email: "r.miller@example.com",
          status: "active",
          plan: "Premium",
          createdAt: "2024-07-22T13:40:00Z",
          lastActive: "2024-11-10T20:30:00Z",
        },
        {
          id: "8",
          name: "Lisa Anderson",
          email: "lisa.a@example.com",
          status: "suspended",
          plan: "Free",
          createdAt: "2024-08-14T10:05:00Z",
          lastActive: "2024-09-20T14:55:00Z",
        },
        {
          id: "9",
          name: "James Wilson",
          email: "james.wilson@example.com",
          status: "active",
          plan: "Premium",
          createdAt: "2024-09-03T15:20:00Z",
          lastActive: "2024-11-11T22:10:00Z",
        },
        {
          id: "10",
          name: "Mary Taylor",
          email: "mary.taylor@example.com",
          status: "active",
          plan: "Enterprise",
          createdAt: "2024-10-18T12:30:00Z",
          lastActive: "2024-11-12T06:40:00Z",
        },
      ]

      // Filter by search if provided
      let filteredUsers = mockUsers
      if (search) {
        const searchLower = search.toLowerCase()
        filteredUsers = mockUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower) ||
            u.id.includes(searchLower)
        )
      }

      // Paginate
      const startIdx = (page - 1) * 10
      const paginatedUsers = filteredUsers.slice(startIdx, startIdx + 10)

      setUsers(paginatedUsers)
      setTotal(filteredUsers.length)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendUser = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this user?")) return

    try {
      await adminApi.suspendUser(userId)
      fetchUsers()
    } catch (err) {
      console.error("Failed to suspend user:", err)
      alert("Action simulated (backend not connected)")
      // Simulate success in mock mode
      fetchUsers()
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      await adminApi.resetUserPassword(userId)
      alert("Password reset link sent to user email")
    } catch (err) {
      console.error("Failed to reset password:", err)
      alert("Password reset simulated (backend not connected)")
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
                <p className="text-2xl font-bold mt-2">{users.filter((u: any) => u.plan === "Premium" || u.plan === "Enterprise").length}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>

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
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-sm">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">User Details</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Joined Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Last Active</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
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
                          <span className="font-semibold text-sm">{user.name}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </td>
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
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            user.plan === "Enterprise"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                              : user.plan === "Premium"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {user.plan || "Free"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(user.createdAt).toLocaleDateString("en-US", { 
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Activity className="w-3.5 h-3.5" />
                          <span>{new Date(user.lastActive).toLocaleDateString("en-US", { 
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
                            onClick={() => alert(`View details for ${user.name}`)}
                            title="View details"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
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
