import { apiCall } from "./auth"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const adminApi = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return res.json()
  },

  // Users endpoints
  getUsers: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters })
    const res = await apiCall(`${API_BASE}/admin/users?${params}`)
    return res.json()
  },

  getUserById: async (id: string) => {
    const res = await apiCall(`${API_BASE}/admin/users/${id}`)
    return res.json()
  },

  updateUser: async (id: string, data: any) => {
    const res = await apiCall(`${API_BASE}/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return res.json()
  },

  suspendUser: async (id: string) => {
    const res = await apiCall(`${API_BASE}/admin/users/${id}/suspend`, {
      method: "POST",
    })
    return res.json()
  },

  resetUserPassword: async (id: string) => {
    const res = await apiCall(`${API_BASE}/admin/users/${id}/reset-password`, {
      method: "POST",
    })
    return res.json()
  },

  // Subscriptions endpoints
  getSubscriptions: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters })
    const res = await apiCall(`${API_BASE}/admin/subscriptions?${params}`)
    return res.json()
  },

  getSubscriptionPlans: async () => {
    const res = await apiCall(`${API_BASE}/admin/subscriptions/plans`)
    return res.json()
  },

  createPlan: async (data: any) => {
    const res = await apiCall(`${API_BASE}/admin/subscriptions/plans`, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return res.json()
  },

  updatePlan: async (id: string, data: any) => {
    const res = await apiCall(`${API_BASE}/admin/subscriptions/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return res.json()
  },

  assignPlanToUser: async (userId: string, planId: string) => {
    const res = await apiCall(`${API_BASE}/admin/subscriptions/assign`, {
      method: "POST",
      body: JSON.stringify({ userId, planId }),
    })
    return res.json()
  },

  // Reports endpoints
  getReports: async (type = "summary", dateRange = {}) => {
    const params = new URLSearchParams({ type, ...dateRange })
    const res = await apiCall(`${API_BASE}/admin/reports?${params}`)
    return res.json()
  },

  getAnalytics: async (period = "monthly") => {
    const res = await apiCall(`${API_BASE}/admin/reports/analytics?period=${period}`)
    return res.json()
  },

  exportData: async (dataType: string, format: string) => {
    const res = await apiCall(`${API_BASE}/admin/reports/export?type=${dataType}&format=${format}`)
    return res.blob()
  },
}
