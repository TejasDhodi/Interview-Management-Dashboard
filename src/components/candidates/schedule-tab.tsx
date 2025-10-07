"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle2, Circle } from "lucide-react"
import type { Interview } from "@/lib/api"
import { listInterviewsByCandidate, updateInterview, createInterview } from "@/lib/interview-store"
import { getCandidate, updateCandidate } from "@/lib/candidate-store"
import { Switch } from "@/components/ui/switch"

interface ScheduleTabProps {
  candidateId: number
}

export function ScheduleTab({ candidateId }: ScheduleTabProps) {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true)
        let data = listInterviewsByCandidate(candidateId)
        // If no interviews exist but candidate has scheduled status, create a default scheduled interview
        if ((data.total === 0 || !data.todos?.length) && getCandidate(candidateId)?.status === "scheduled") {
          createInterview(candidateId, "Scheduled Interview", false)
          data = listInterviewsByCandidate(candidateId)
        }
        setInterviews(data.todos as unknown as Interview[])
      } catch (error) {
        console.error("[v0] Failed to load interviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInterviews()
  }, [candidateId])

  const toggleCompleted = async (interviewId: number, next: boolean) => {
    // optimistic update
    setInterviews((prev) => prev.map((i) => (i.id === interviewId ? { ...i, completed: next } : i)))
    try {
      const updated = updateInterview(candidateId, interviewId, { completed: next })
      if (!updated) throw new Error("Failed to update interview")
      
      // Update candidate status based on interview completion
      const candidate = getCandidate(candidateId)
      if (candidate) {
        const allInterviews = listInterviewsByCandidate(candidateId)
        const allCompleted = allInterviews.todos.every(i => i.completed)
        const anyCompleted = allInterviews.todos.some(i => i.completed)
        
        let newStatus = candidate.status
        if (allCompleted && allInterviews.todos.length > 0) {
          newStatus = "completed"
        } else if (anyCompleted) {
          newStatus = "scheduled" // Keep as scheduled if some are done but not all
        }
        
        if (newStatus !== candidate.status) {
          updateCandidate(candidateId, { status: newStatus })
        }
      }
    } catch (e) {
      // revert on failure
      setInterviews((prev) => prev.map((i) => (i.id === interviewId ? { ...i, completed: !next } : i)))
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (interviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No interviews scheduled</h3>
          <p className="text-muted-foreground text-center">This candidate has no scheduled interviews yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <div
                key={interview.id}
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  {interview.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1">{interview.todo}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(Date.now() + index * 86400000).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{10 + (index % 8)}:00 AM</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={interview.completed ? "default" : "secondary"}>
                        {interview.completed ? "Completed" : "Scheduled"}
                      </Badge>
                      <Switch
                        checked={interview.completed}
                        onCheckedChange={(checked) => toggleCompleted(interview.id, checked)}
                        aria-label="Toggle completed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{interviews.length}</p>
              <p className="text-sm text-muted-foreground">Total Interviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{interviews.filter((i) => i.completed).length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{interviews.filter((i) => !i.completed).length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
