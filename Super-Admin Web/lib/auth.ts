export const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("admin_token")
}

export const setAuthToken = (token: string) => {
  localStorage.setItem("admin_token", token)
}

export const removeAuthToken = () => {
  localStorage.removeItem("admin_token")
  localStorage.removeItem("admin_user")
}

export const getAuthUser = () => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("admin_user")
  return user ? JSON.parse(user) : null
}

export const setAuthUser = (user: any) => {
  localStorage.setItem("admin_user", JSON.stringify(user))
}

// API helper with JWT
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    removeAuthToken()
    window.location.href = "/"
  }

  return response
}
