"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Check, X } from "lucide-react"
import type { UserRole } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface UserWithRole {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  role: UserRole
  permissions: string[]
}

interface RoleManagementTableProps {
  users: UserWithRole[]
  onRoleChange: (userId: number, newRole: UserRole) => void
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

export function RoleManagementTable({ users, onRoleChange }: RoleManagementTableProps) {
  const [editingUserId, setEditingUserId] = useState<number | null>(null)

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "ta_member":
        return "bg-primary/20 text-primary border-primary/30"
      case "panelist":
        return "bg-accent/20 text-accent border-accent/30"
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "ta_member":
        return "TA Member"
      case "panelist":
        return "Panelist"
    }
  }

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    onRoleChange(userId, newRole)
    setEditingUserId(null)
  }

  return (
    <div className="space-y-6">
      {/* Permissions Legend */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(Object.keys(rolePermissions) as UserRole[]).map((role) => (
          <div key={role} className="p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">{getRoleLabel(role)}</h4>
            </div>
            <ul className="space-y-2 text-sm">
              {rolePermissions[role].map((permission) => (
                <li key={permission} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{permission}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[300px]">User</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-accent/30 border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.image || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="ta_member">TA Member</SelectItem>
                          <SelectItem value="panelist">Panelist</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className={cn("capitalize", getRoleBadgeColor(user.role))}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{user.permissions.length} permissions</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingUserId === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUserId(null)}
                          className="h-8 hover:bg-accent/50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUserId(user.id)}
                        className="h-8 hover:bg-accent/50"
                      >
                        Change Role
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
