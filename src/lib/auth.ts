export type UserRole = "admin" | "ta_member" | "panelist"

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  token: string
}

export interface AuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  })

  if (!response.ok) {
    throw new Error("Invalid credentials")
  }

  return response.json()
}

export function saveSession(user: User): void {
  // Store user data in localStorage for persistence across sessions
  localStorage.setItem("user", JSON.stringify(user))
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem("user")
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return roles.includes(userRole)
}
