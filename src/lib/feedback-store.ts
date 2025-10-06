export interface FeedbackRecord {
  id: number
  candidateId: number
  title: string
  body: string
  reactions: { likes: number; dislikes: number }
  views: number
  submittedBy: number
  submittedAt: string
}

import { readFromLocalStorage, writeToLocalStorage } from "@/lib/ls"

const LS_KEY = "feedback"

let inMemory: FeedbackRecord[] = []
let lastId = 2000

function hydrate() {
  if (typeof window !== "undefined") {
    inMemory = readFromLocalStorage<FeedbackRecord[]>(LS_KEY, inMemory)
  }
}

export function listFeedbackByCandidate(candidateId: number): FeedbackRecord[] {
  hydrate()
  return inMemory.filter(f => f.candidateId === candidateId)
}

export function createFeedback(data: Omit<FeedbackRecord, "id" | "views" | "reactions"> & { reactions?: { likes: number; dislikes: number } }): FeedbackRecord {
  hydrate()
  const record: FeedbackRecord = {
    id: ++lastId,
    views: 0,
    reactions: data.reactions ?? { likes: 0, dislikes: 0 },
    ...data,
  }
  inMemory.unshift(record)
  writeToLocalStorage(LS_KEY, inMemory)
  return record
}

export function incrementViewsForCandidate(candidateId: number) {
  hydrate()
  inMemory = inMemory.map(f => (f.candidateId === candidateId ? { ...f, views: f.views + 1 } : f))
  writeToLocalStorage(LS_KEY, inMemory)
}

export function seedFeedback(seed: FeedbackRecord[]) {
  inMemory = [...seed]
  lastId = seed.reduce((max, f) => Math.max(max, f.id), lastId)
  writeToLocalStorage(LS_KEY, inMemory)
}
