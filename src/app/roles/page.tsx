"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RoleManagementTable } from "@/components/roles/role-management-table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react"
import { fetchCandidates } from "@/lib/api"
import type { UserRole } from "@/lib/auth"
// import { useToast } from "@/hooks/use-toast"

interface UserWithRole {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  role: UserRole
  permissions: string[]
}

const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "View all candidates",
    "Manage candidates",
    "View all feedback",
    "Schedule interviews",
    "Manage user roles",
    "Access analytics",
  ],
  ta_member: ["View all candidates", "Manage candidates", "View feedback", "Schedule interviews", "Access analytics"],
  panelist: ["View assigned candidates", "Submit feedback", "View own feedback"],
}

// Assign random roles to users for demo
const assignRandomRole = (): UserRole => {
  const roles: UserRole[] = ["admin", "ta_member", "panelist"]
  return roles[Math.floor(Math.random() * roles.length)]
}

export default function RolesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
//   const { toast } = useToast()
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "admin") {
      // Redirect non-admins
      router.push("/dashboard/admin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const data = await fetchCandidates(20, 0)
        // Convert candidates to users with roles
        const usersWithRoles: UserWithRole[] = data.users.map((candidate) => {
          const role = assignRandomRole()
          return {
            id: candidate.id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            image: candidate.image,
            role,
            permissions: rolePermissions[role],
          }
        })
        setUsers(usersWithRoles)
      } catch (error) {
        console.error("[v0] Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && user.role === "admin") {
      loadUsers()
    }
  }, [user])

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole, permissions: rolePermissions[newRole] } : u)),
    )

    // toast({
    //   title: "Role Updated",
    //   description: `User role has been successfully changed to ${newRole.replace("_", " ")}.`,
    // })
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You do not have permission to access role management. Only administrators can access this page.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/dashboard/admin")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
              <p className="text-muted-foreground">Manage user roles and permissions across the platform</p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            As an administrator, you can change user roles to control their access and permissions. Changes take effect
            immediately.
          </AlertDescription>
        </Alert>

        {/* Role Management Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <RoleManagementTable users={users} onRoleChange={handleRoleChange} />
        )}
      </div>
    </DashboardLayout>
  )
}
