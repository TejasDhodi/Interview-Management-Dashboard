"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createCandidate, updateCandidate, deleteCandidate } from "@/lib/candidate-store"

interface CompanyInput {
  department: string
  name: string
  title: string
}

export function CandidateCreateButton({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dept, setDept] = useState("")
  const [roleTitle, setRoleTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async () => {
    try {
      setSubmitting(true)
      const company: CompanyInput = { department: dept, title: roleTitle, name: companyName }
      createCandidate({ firstName, lastName, email, phone, company, image: "/placeholder.svg" })
      onCreated()
      setOpen(false)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setDept("")
      setRoleTitle("")
      setCompanyName("")
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm">Add Candidate</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[520px] p-4">
        <div className="text-sm font-medium mb-2">New Candidate</div>
        <div className="grid gap-3 py-1">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Department" value={dept} onChange={(e) => setDept(e.target.value)} />
            <Input placeholder="Title" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
            <Input placeholder="Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="flex justify-end pt-1">
            <Button onClick={handleCreate} disabled={submitting || !firstName || !lastName || !email || !dept || !roleTitle}>
              {submitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function CandidateEditButton({
  id,
  initial: {
    firstName: initialFirst,
    lastName: initialLast,
    email: initialEmail,
    phone: initialPhone,
    company: initialCompany,
  },
  onUpdated,
}: {
  id: number
  initial: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: CompanyInput
  }
  onUpdated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState(initialFirst)
  const [lastName, setLastName] = useState(initialLast)
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState(initialPhone)
  const [dept, setDept] = useState(initialCompany.department)
  const [roleTitle, setRoleTitle] = useState(initialCompany.title)
  const [companyName, setCompanyName] = useState(initialCompany.name)
  const [submitting, setSubmitting] = useState(false)

  const handleUpdate = async () => {
    try {
      setSubmitting(true)
      const company: CompanyInput = { department: dept, title: roleTitle, name: companyName }
      const updated = updateCandidate(id, { firstName, lastName, email, phone, company })
      if (!updated) throw new Error("Failed to update candidate")
      onUpdated()
      setOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">Edit</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[520px] p-4">
        <div className="text-sm font-medium mb-2">Edit Candidate</div>
        <div className="grid gap-3 py-1">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Department" value={dept} onChange={(e) => setDept(e.target.value)} />
            <Input placeholder="Title" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
            <Input placeholder="Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="flex justify-end pt-1">
            <Button onClick={handleUpdate} disabled={submitting || !firstName || !lastName || !email || !dept || !roleTitle}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function CandidateDeleteButton({ id, onDeleted }: { id: number; onDeleted: () => void }) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    try {
      setSubmitting(true)
      const ok = deleteCandidate(id)
      if (!ok) throw new Error("Failed to delete candidate")
      onDeleted()
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={submitting}>
      {submitting ? "Deleting..." : "Delete"}
    </Button>
  )
}


