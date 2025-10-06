"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, MessageSquare, ArrowUpDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import type { Candidate } from "@/lib/api"
import { cn } from "@/lib/utils"
import { CandidateEditButton, CandidateDeleteButton } from "@/components/candidates/candidate-actions"

interface CandidateTableProps {
  candidates: Candidate[]
}

type SortField = "name" | "department" | "role" | "status"
type SortOrder = "asc" | "desc"

export function CandidateTable({ candidates }: CandidateTableProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    let aValue: string
    let bValue: string

    switch (sortField) {
      case "name":
        aValue = `${a.firstName} ${a.lastName}`
        bValue = `${b.firstName} ${b.lastName}`
        break
      case "department":
        aValue = a.company.department
        bValue = b.company.department
        break
      case "role":
        aValue = a.company.title
        bValue = b.company.title
        break
      case "status":
        aValue = a.status || "pending"
        bValue = b.status || "pending"
        break
      default:
        return 0
    }

    const comparison = aValue.localeCompare(bValue)
    return sortOrder === "asc" ? comparison : -comparison
  })

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-accent/20 text-accent border-accent/30"
      case "scheduled":
        return "bg-primary/20 text-primary border-primary/30"
      case "cancelled":
        return "bg-destructive/20 text-destructive border-destructive/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const canViewDetails = user?.role === "admin" || user?.role === "ta_member" || user?.role === "panelist"
  const canSubmitFeedback = user?.role === "panelist"
  const canManage = user?.role === "admin" || user?.role === "ta_member" || user?.role === "panelist"

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-8 px-2 hover:bg-accent/50 -ml-2"
                >
                  Candidate
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("department")}
                  className="h-8 px-2 hover:bg-accent/50 -ml-2"
                >
                  Department
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("role")}
                  className="h-8 px-2 hover:bg-accent/50 -ml-2"
                >
                  Role
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-8 px-2 hover:bg-accent/50 -ml-2"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCandidates.map((candidate) => (
              <TableRow key={candidate.id} className="hover:bg-accent/30 border-border">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={candidate.image || "/placeholder.svg"}
                        alt={`${candidate.firstName} ${candidate.lastName}`}
                      />
                      <AvatarFallback>
                        {candidate.firstName[0]}
                        {candidate.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{candidate.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm">{candidate.company.department}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm">{candidate.company.title}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", getStatusColor(candidate.status))}>
                    {candidate.status || "pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/candidates/${candidate.id}`)}
                        className="h-8 hover:bg-accent/50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    )}
                    {canSubmitFeedback && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/candidates/${candidate.id}?tab=feedback`)}
                        className="h-8 hover:bg-accent/50"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Feedback</span>
                      </Button>
                    )}
                    {canManage && (
                      <>
                        <CandidateEditButton
                          id={candidate.id}
                          initial={{
                            firstName: candidate.firstName,
                            lastName: candidate.lastName,
                            email: candidate.email,
                            phone: candidate.phone,
                            company: candidate.company,
                          }}
                          onUpdated={() => {
                            // simple approach: reload the page data
                            router.refresh?.()
                          }}
                        />
                        <CandidateDeleteButton
                          id={candidate.id}
                          onDeleted={() => {
                            router.refresh?.()
                          }}
                        />
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
