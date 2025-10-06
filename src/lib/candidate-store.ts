export type CandidateStatus = "scheduled" | "completed" | "cancelled"

export interface CandidateRecord {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  company: {
    department: string
    name: string
    title: string
  }
  image: string
  status: CandidateStatus
}

import { readFromLocalStorage, writeToLocalStorage } from "@/lib/ls"

const LS_KEY = "candidates"

let inMemory: CandidateRecord[] = []
let lastId = 1000

function hydrate() {
  if (typeof window !== "undefined") {
    inMemory = readFromLocalStorage<CandidateRecord[]>(LS_KEY, inMemory)
  }
}

export function listCandidates(): CandidateRecord[] {
  hydrate()
  return [...inMemory]
}

export function getCandidate(id: number): CandidateRecord | undefined {
  hydrate()
  return inMemory.find(c => c.id === id)
}

export function createCandidate(data: Omit<CandidateRecord, "id" | "status"> & { status?: CandidateStatus }): CandidateRecord {
  hydrate()
  const record: CandidateRecord = { id: ++lastId, status: data.status ?? "scheduled", ...data }
  inMemory.unshift(record)
  writeToLocalStorage(LS_KEY, inMemory)
  return record
}

export function updateCandidate(id: number, updates: Partial<Omit<CandidateRecord, "id">>): CandidateRecord | undefined {
  hydrate()
  const idx = inMemory.findIndex(c => c.id === id)
  if (idx === -1) return undefined
  const updated = { ...inMemory[idx], ...updates }
  inMemory[idx] = updated
  writeToLocalStorage(LS_KEY, inMemory)
  return updated
}

export function deleteCandidate(id: number): boolean {
  hydrate()
  const before = inMemory.length
  inMemory = inMemory.filter(c => c.id !== id)
  writeToLocalStorage(LS_KEY, inMemory)
  return inMemory.length < before
}

export function seedCandidates(seed: CandidateRecord[]) {
  inMemory = [...seed]
  lastId = seed.reduce((max, c) => Math.max(max, c.id), lastId)
  writeToLocalStorage(LS_KEY, inMemory)
}
