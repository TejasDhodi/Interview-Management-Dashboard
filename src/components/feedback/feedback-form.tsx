"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createFeedback } from "@/lib/feedback-store"

interface FeedbackFormProps {
  candidateId: number
  candidateName: string
}

interface FormData {
  overallScore: string
  strengths: string
  improvements: string
  comments: string
}

interface FormErrors {
  overallScore?: string
  strengths?: string
  improvements?: string
}

export function FeedbackForm({ candidateId, candidateName }: FeedbackFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    overallScore: "",
    strengths: "",
    improvements: "",
    comments: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input.replace(/[<>]/g, "").trim()
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate overall score
    if (!formData.overallScore) {
      newErrors.overallScore = "Overall score is required"
    }

    // Validate strengths (minimum 10 characters)
    if (!formData.strengths.trim()) {
      newErrors.strengths = "Strengths field is required"
    } else if (formData.strengths.trim().length < 10) {
      newErrors.strengths = "Please provide at least 10 characters"
    }

    // Validate improvements (minimum 10 characters)
    if (!formData.improvements.trim()) {
      newErrors.improvements = "Areas for improvement field is required"
    } else if (formData.improvements.trim().length < 10) {
      newErrors.improvements = "Please provide at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    // Check if user is panelist
    if (user?.role !== "panelist") {
      setErrors({ overallScore: "Only panelists can submit feedback" })
      return
    }

    setIsSubmitting(true)

    try {
      // Sanitize and map to API payload
      const title = `Score ${sanitizeInput(formData.overallScore)} / 5`
      const body = [
        `Strengths: ${sanitizeInput(formData.strengths)}`,
        `Improvements: ${sanitizeInput(formData.improvements)}`,
        formData.comments ? `Comments: ${sanitizeInput(formData.comments)}` : undefined,
      ]
        .filter(Boolean)
        .join("\n\n")

      createFeedback({ candidateId, title, body, submittedBy: user.id, submittedAt: new Date().toISOString() })

      setIsSubmitted(true)

      // Redirect after success
      setTimeout(() => {
        router.push(`/candidates/${candidateId}?tab=feedback`)
      }, 1000)
    } catch (error) {
      setErrors({ overallScore: "Failed to submit feedback. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-accent/20 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Feedback Submitted Successfully!</h3>
          <p className="text-muted-foreground text-center mb-4">Your feedback for {candidateName} has been recorded.</p>
          <p className="text-sm text-muted-foreground">Redirecting to candidate profile...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Interview Feedback</CardTitle>
        <CardDescription>
          Provide your evaluation for <span className="font-semibold text-foreground">{candidateName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Score */}
          <div className="space-y-2">
            <Label htmlFor="overallScore">
              Overall Score <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.overallScore} onValueChange={(value) => handleInputChange("overallScore", value)}>
              <SelectTrigger id="overallScore" className={errors.overallScore ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 - Excellent</SelectItem>
                <SelectItem value="4">4 - Very Good</SelectItem>
                <SelectItem value="3">3 - Good</SelectItem>
                <SelectItem value="2">2 - Fair</SelectItem>
                <SelectItem value="1">1 - Poor</SelectItem>
              </SelectContent>
            </Select>
            {errors.overallScore && <p className="text-sm text-destructive">{errors.overallScore}</p>}
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <Label htmlFor="strengths">
              Strengths <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="strengths"
              placeholder="Describe the candidate's key strengths and positive attributes..."
              value={formData.strengths}
              onChange={(e) => handleInputChange("strengths", e.target.value)}
              className={errors.strengths ? "border-destructive" : ""}
              rows={4}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              {errors.strengths ? (
                <p className="text-sm text-destructive">{errors.strengths}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Minimum 10 characters required</p>
              )}
              <p className="text-xs text-muted-foreground">{formData.strengths.length}/500</p>
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-2">
            <Label htmlFor="improvements">
              Areas for Improvement <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="improvements"
              placeholder="Identify areas where the candidate could improve..."
              value={formData.improvements}
              onChange={(e) => handleInputChange("improvements", e.target.value)}
              className={errors.improvements ? "border-destructive" : ""}
              rows={4}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              {errors.improvements ? (
                <p className="text-sm text-destructive">{errors.improvements}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Minimum 10 characters required</p>
              )}
              <p className="text-xs text-muted-foreground">{formData.improvements.length}/500</p>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Any additional observations or notes..."
              value={formData.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{formData.comments.length}/500</p>
          </div>

          {/* Role Check Alert */}
          {user?.role !== "panelist" && (
            <Alert variant="destructive">
              <AlertDescription>Only panelists are authorized to submit feedback.</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || user?.role !== "panelist"} className="flex-1 sm:flex-none">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/candidates/${candidateId}?tab=feedback`)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
