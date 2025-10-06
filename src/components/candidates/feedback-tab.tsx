"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Eye, Plus } from "lucide-react"
import type { Feedback } from "@/lib/api"
import { listFeedbackByCandidate } from "@/lib/feedback-store"
import { useAuth } from "@/contexts/auth-context"

interface FeedbackTabProps {
  candidateId: number
  onSubmitFeedback?: () => void
}

export function FeedbackTab({ candidateId, onSubmitFeedback }: FeedbackTabProps) {
  const { user } = useAuth()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true)
        const posts = listFeedbackByCandidate(candidateId) as unknown as Feedback[]
        setFeedbacks(posts)
      } catch (error) {
        console.error("[v0] Failed to load feedback:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeedback()
  }, [candidateId])

  const canSubmitFeedback = user?.role === "panelist"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Submit Feedback Button - Only for Panelists */}
      {canSubmitFeedback && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold mb-1">Submit Your Feedback</h3>
                <p className="text-sm text-muted-foreground">Share your evaluation and insights for this candidate</p>
              </div>
              <Button onClick={onSubmitFeedback} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback List */}
      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
            <p className="text-muted-foreground text-center">
              {canSubmitFeedback
                ? "Be the first to submit feedback for this candidate."
                : "No feedback has been submitted for this candidate yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{feedback.title}</CardTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                        Score: {Math.max(1, Math.min(5, Math.round((feedback.reactions?.likes ?? 0) / 20)))} / 5
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{feedback.reactions?.likes ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{feedback.views ?? 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{feedback.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Feedback Summary */}
      {feedbacks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{feedbacks.length}</p>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">
                  {(feedbacks.reduce((acc, f) => acc + f.reactions.likes, 0) / feedbacks.length / 20).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{feedbacks.reduce((acc, f) => acc + f.views, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
