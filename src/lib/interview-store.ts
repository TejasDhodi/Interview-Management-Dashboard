export interface InterviewRecord {
  id: number
  candidateId: number
  todo: string
  completed: boolean
}

import { readFromLocalStorage, writeToLocalStorage } from "@/lib/ls"

const LS_KEY = "interviews"

let inMemory: InterviewRecord[] = []
let lastId = 3000

function hydrate() {
  if (typeof window !== "undefined") {
    inMemory = readFromLocalStorage<InterviewRecord[]>(LS_KEY, inMemory)
  }
}

export function listInterviewsByCandidate(candidateId: number): { todos: InterviewRecord[]; total: number } {
  hydrate()
  const todos = inMemory.filter(i => i.candidateId === candidateId)
  return { todos, total: todos.length }
}

export function createInterview(candidateId: number, todo: string, completed = false): InterviewRecord {
  hydrate()
  const record: InterviewRecord = { id: ++lastId, candidateId, todo, completed }
  inMemory.unshift(record)
  writeToLocalStorage(LS_KEY, inMemory)
  return record
}

export function seedInterviews(seed: InterviewRecord[]) {
  inMemory = [...seed]
  lastId = seed.reduce((max, i) => Math.max(max, i.id), lastId)
  writeToLocalStorage(LS_KEY, inMemory)
}

export function updateInterview(
  candidateId: number,
  interviewId: number,
  updates: Partial<Pick<InterviewRecord, "todo" | "completed">>
): InterviewRecord | undefined {
  hydrate()
  const idx = inMemory.findIndex((i) => i.id === interviewId && i.candidateId === candidateId)
  if (idx === -1) return undefined
  const next = { ...inMemory[idx], ...updates }
  inMemory[idx] = next
  writeToLocalStorage(LS_KEY, inMemory)
  return next
}
