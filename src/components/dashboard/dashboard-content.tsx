"use client"

import { useEffect, useState } from "react"
import { KPICard } from "./kpi-card"
import { DashboardFilters, type FilterState } from "./dashboard-filters"
import { Calendar, TrendingUp, UserX, Users, ClipboardCheck, Clock } from "lucide-react"
import { listCandidates } from "@/lib/candidate-store"
import { listFeedbackByCandidate } from "@/lib/feedback-store"
import { listInterviewsByCandidate } from "@/lib/interview-store"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function DashboardContent() {
  const { user } = useAuth()
  const [kpis, setKpis] = useState({
    interviewsThisWeek: 0,
    averageFeedbackScore: "0.0",
    noShows: 0,
    totalCandidates: 0,
    completedInterviews: 0,
    pendingFeedback: 0,
  })
  const [filters, setFilters] = useState<FilterState>({
    role: "all",
    interviewer: "all",
    dateRange: { from: undefined, to: undefined },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calculateKPIs = () => {
      try {
        setLoading(true)
        const candidates = listCandidates()
        const totalCandidates = candidates.length
        
        // Count candidates by status
        const scheduled = candidates.filter(c => c.status === "scheduled").length
        const completed = candidates.filter(c => c.status === "completed").length
        const cancelled = candidates.filter(c => c.status === "cancelled").length
        
        // Count completed interviews across all candidates
        let completedInterviews = 0
        let totalFeedback = 0
        let feedbackCount = 0
        
        candidates.forEach(candidate => {
          const interviews = listInterviewsByCandidate(candidate.id)
          completedInterviews += interviews.todos.filter(i => i.completed).length
          
          const feedback = listFeedbackByCandidate(candidate.id)
          totalFeedback += feedback.length
          feedbackCount += feedback.length
        })
        
        // Calculate average feedback score (simplified)
        const averageScore = feedbackCount > 0 ? (totalFeedback / feedbackCount).toFixed(1) : "0.0"
        
        setKpis({
          interviewsThisWeek: scheduled,
          averageFeedbackScore: averageScore,
          noShows: cancelled,
          totalCandidates,
          completedInterviews,
          pendingFeedback: scheduled, // Assume scheduled interviews need feedback
        })
      } catch (error) {
        console.error("Failed to calculate KPIs:", error)
      } finally {
        setLoading(false)
      }
    }
    
    calculateKPIs()
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
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : kpis.totalCandidates === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">Start by adding some candidates to see dashboard metrics.</p>
            <Link
              href="/candidates"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                 Add Candidates 
            </Link>
          </div>
        ) : (
          <>
            <KPICard
              title="Interviews This Week"
              value={kpis.interviewsThisWeek}
              icon={Calendar}
              description="Scheduled interviews"
              trend={undefined}
            />

            <KPICard
              title="Average Feedback Score"
              value={kpis.averageFeedbackScore}
              icon={TrendingUp}
              description="Out of 5.0"
              trend={undefined}
            />

            <KPICard
              title="No-Shows"
              value={kpis.noShows}
              icon={UserX}
              description="Candidates who didn't attend"
              trend={undefined}
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
          </>
        )}
      </div>

      {/* Quick Actions based on role */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {user?.role === "admin" && (
          <Link href="/candidates" passHref>
            <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <h4 className="font-medium mb-1">Manage Candidates</h4>
              <p className="text-sm text-muted-foreground">View and manage all candidates</p>
            </div>
          </Link>
        )}

        {(user?.role === "admin" || user?.role === "ta_member") && (
          <Link href="/candidates" passHref>
            <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <h4 className="font-medium mb-1">Schedule Interviews</h4>
              <p className="text-sm text-muted-foreground">Set up new interview sessions</p>
            </div>
          </Link>
        )}

        {user?.role === "panelist" && (
          <Link href="/candidates" passHref>
            <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <h4 className="font-medium mb-1">Submit Feedback</h4>
              <p className="text-sm text-muted-foreground">Provide feedback for interviews</p>
            </div>
          </Link>
        )}

        <Link href="/candidates" passHref>
          <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
            <h4 className="font-medium mb-1">View Candidates</h4>
            <p className="text-sm text-muted-foreground">Browse candidate profiles</p>
          </div>
        </Link>

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
