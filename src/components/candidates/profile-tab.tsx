import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Building2, Briefcase } from "lucide-react"
import type { CandidateRecord } from "@/lib/candidate-store"

interface ProfileTabProps {
  candidate: CandidateRecord
}

export function ProfileTab({ candidate }: ProfileTabProps) {
  const firstName = candidate.firstName || ""
  const lastName = candidate.lastName || ""
  const companyName = candidate.company?.name || "—"
  const companyTitle = candidate.company?.title || "—"
  const companyDept = candidate.company?.department || "—"
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={candidate.image || "/placeholder.svg"} alt={`${firstName} ${lastName}`} />
              <AvatarFallback className="text-2xl">
                {firstName?.[0] ?? "?"}
                {lastName?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-2xl font-bold">
                  {firstName} {lastName}
                </h2>
                <p className="text-muted-foreground">{companyTitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {candidate.status || "scheduled"}
                </Badge>
                <Badge variant="outline">{companyDept}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium truncate">{candidate.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{candidate.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium truncate">{companyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{companyDept}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{companyTitle}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Section */}
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Experienced professional with a strong background in {companyDept.toLowerCase()}.
                Currently working as {companyTitle} at {companyName}. Demonstrated expertise in team collaboration,
                project management, and technical skills.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Leadership</Badge>
                <Badge variant="secondary">Communication</Badge>
                <Badge variant="secondary">Problem Solving</Badge>
                <Badge variant="secondary">Team Management</Badge>
                <Badge variant="secondary">Strategic Planning</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Experience</h4>
              <div className="space-y-3">
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-medium">{companyTitle}</p>
                  <p className="text-sm text-muted-foreground">{companyName}</p>
                  <p className="text-xs text-muted-foreground mt-1">2020 - Present</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
