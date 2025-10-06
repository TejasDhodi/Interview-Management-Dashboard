"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FeedbackForm } from "@/components/feedback/feedback-form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import type { Candidate } from "@/lib/api"
import { getCandidate } from "@/lib/candidate-store"

export default function FeedbackFormPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "panelist") {
      // Redirect non-panelists
      router.push(`/candidates/${params.id}?tab=feedback`)
    }
  }, [user, isLoading, router, params.id])

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        setLoading(true)
        const found = getCandidate(Number(params.id)) as unknown as Candidate | undefined
        if (!found) throw new Error("not found")
        setCandidate(found)
      } catch (error) {
        console.error("[v0] Failed to load candidate:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && user.role === "panelist") {
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

  if (user.role !== "panelist") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You do not have permission to submit feedback. Only panelists can access this page.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/candidates")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Candidates
          </Button>
        </div>
      </DashboardLayout>
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push(`/candidates/${params.id}?tab=feedback`)}
          className="hover:bg-accent/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidate Profile
        </Button>

        {/* Feedback Form */}
        <FeedbackForm candidateId={candidate.id} candidateName={`${candidate.firstName} ${candidate.lastName}`} />
      </div>
    </DashboardLayout>
  )
}
