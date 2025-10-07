"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileTab } from "@/components/candidates/profile-tab"
import { ScheduleTab } from "@/components/candidates/schedule-tab"
import { FeedbackTab } from "@/components/candidates/feedback-tab"
import { ArrowLeft } from "lucide-react"
import type { CandidateRecord } from "@/lib/candidate-store"
import { getCandidate } from "@/lib/candidate-store"

export default function CandidateDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ id: string }>()
  const [candidate, setCandidate] = useState<CandidateRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        setLoading(true)
        const found = getCandidate(Number(params.id))
        if (!found) throw new Error("not found")
        setCandidate(found)
      } catch (error) {
        console.error("[v0] Failed to load candidate:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadCandidate()
    }
  }, [params.id, user])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Candidate not found</h2>
          <p className="text-muted-foreground mb-4">The candidate you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/candidates")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Candidates
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const canViewSchedule = user.role === "admin" || user.role === "ta_member" || user.role === "panelist"
  const canViewFeedback = user.role === "admin" || user.role === "ta_member" || user.role === "panelist"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/candidates")} className="hover:bg-accent/50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Button>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {canViewSchedule && <TabsTrigger value="schedule">Schedule</TabsTrigger>}
            {canViewFeedback && <TabsTrigger value="feedback">Feedback</TabsTrigger>}
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileTab candidate={candidate} />
          </TabsContent>

          {canViewSchedule && (
            <TabsContent value="schedule" className="mt-6">
              <ScheduleTab candidateId={candidate.id} />
            </TabsContent>
          )}

          {canViewFeedback && (
            <TabsContent value="feedback" className="mt-6">
              <FeedbackTab
                candidateId={candidate.id}
                onSubmitFeedback={() => router.push(`/candidates/${candidate.id}/feedback`)}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
