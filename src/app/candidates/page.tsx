"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CandidateFilters } from "@/components/candidates/candidate-filters"
import { CandidateTable } from "@/components/candidates/candidate-table"
import { CandidateCreateButton } from "@/components/candidates/candidate-actions"
import type { Candidate } from "@/lib/api"
import { listCandidates } from "@/lib/candidate-store"

export default function CandidatesListPage() {
  const { user, isLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!isLoading && !user) return

    const load = () => {
      try {
        setLoading(true)
        const items = listCandidates() as unknown as Candidate[]
        setCandidates(items)
      } catch (e) {
        console.error("Failed to load candidates", e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isLoading, user])

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch = `${c.firstName} ${c.lastName} ${c.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesDept = departmentFilter === "all" || c.company.department === departmentFilter
      const matchesStatus = statusFilter === "all" || (c.status || "pending") === statusFilter
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [candidates, searchQuery, departmentFilter, statusFilter])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
          <CandidateCreateButton onCreated={() => {
            // simple refresh
            try {
              setLoading(true)
              const items = listCandidates() as unknown as Candidate[]
              setCandidates(items)
            } finally {
              setLoading(false)
            }
          }} />
        </div>

        <CandidateFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <CandidateTable candidates={filtered} />
        )}
      </div>
    </DashboardLayout>
  )
}
