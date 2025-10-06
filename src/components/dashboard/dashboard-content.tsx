"use client"

import { useEffect, useState } from "react"
import { KPICard } from "./kpi-card"
import { DashboardFilters, type FilterState } from "./dashboard-filters"
import { Calendar, TrendingUp, UserX, Users, ClipboardCheck, Clock } from "lucide-react"
import { generateMockKPIs } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

export function DashboardContent() {
  const { user } = useAuth()
  const [kpis, setKpis] = useState(generateMockKPIs())
  const [filters, setFilters] = useState<FilterState>({
    role: "all",
    interviewer: "all",
    dateRange: { from: undefined, to: undefined },
  })

  useEffect(() => {
    // Regenerate KPIs when filters change (simulating filtered data)
    setKpis(generateMockKPIs())
  }, [filters])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.firstName}! Here&apos;s what&apos;s happening with your interviews.
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters onFilterChange={handleFilterChange} />

      {/* KPI Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Interviews This Week"
          value={kpis.interviewsThisWeek}
          icon={Calendar}
          description="Scheduled interviews"
          trend={{ value: 12, isPositive: true }}
        />

        <KPICard
          title="Average Feedback Score"
          value={kpis.averageFeedbackScore}
          icon={TrendingUp}
          description="Out of 5.0"
          trend={{ value: 8, isPositive: true }}
        />

        <KPICard
          title="No-Shows"
          value={kpis.noShows}
          icon={UserX}
          description="Candidates who didn't attend"
          trend={{ value: 15, isPositive: false }}
        />

        <KPICard
          title="Total Candidates"
          value={kpis.totalCandidates}
          icon={Users}
          description="In the system"
          className="sm:col-span-2 lg:col-span-1"
        />

        <KPICard
          title="Completed Interviews"
          value={kpis.completedInterviews}
          icon={ClipboardCheck}
          description="This month"
          className="sm:col-span-2 lg:col-span-1"
        />

        <KPICard
          title="Pending Feedback"
          value={kpis.pendingFeedback}
          icon={Clock}
          description="Awaiting submission"
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Quick Actions based on role */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {user?.role === "admin" && (
            <a
              href="/candidates"
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <h4 className="font-medium mb-1">Manage Candidates</h4>
              <p className="text-sm text-muted-foreground">View and manage all candidates</p>
            </a>
          )}

          {(user?.role === "admin" || user?.role === "ta_member") && (
            <a
              href="/candidates"
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <h4 className="font-medium mb-1">Schedule Interviews</h4>
              <p className="text-sm text-muted-foreground">Set up new interview sessions</p>
            </a>
          )}

          {user?.role === "panelist" && (
            <a
              href="/candidates"
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <h4 className="font-medium mb-1">Submit Feedback</h4>
              <p className="text-sm text-muted-foreground">Provide feedback for interviews</p>
            </a>
          )}

          <a
            href="/candidates"
            className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <h4 className="font-medium mb-1">View Candidates</h4>
            <p className="text-sm text-muted-foreground">Browse candidate profiles</p>
          </a>

          {user?.role === "admin" && (
            <a
              href="/roles"
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <h4 className="font-medium mb-1">Role Management</h4>
              <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
