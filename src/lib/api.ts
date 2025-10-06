export interface Candidate {
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
    role?: string
    status?: "scheduled" | "completed" | "no-show" | "pending"
  }
  
  export interface Interview {
    id: number
    todo: string
    completed: boolean
    userId: number
  }
  
  export interface Feedback {
    id: number
    title: string
    body: string
    userId: number
    reactions: {
      likes: number
      dislikes: number
    }
    views: number
  }
  
  export async function fetchCandidates(limit = 30, skip = 0): Promise<{ users: Candidate[]; total: number }> {
    const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
    if (!response.ok) throw new Error("Failed to fetch candidates")
    return response.json()
  }
  
  export async function fetchCandidateById(id: number): Promise<Candidate> {
    const response = await fetch(`https://dummyjson.com/users/${id}`)
    if (!response.ok) throw new Error("Failed to fetch candidate")
    return response.json()
  }
  
  export async function fetchInterviewsByUserId(userId: number): Promise<{ todos: Interview[]; total: number }> {
    const response = await fetch(`https://dummyjson.com/todos/user/${userId}`)
    if (!response.ok) throw new Error("Failed to fetch interviews")
    return response.json()
  }
  
  export async function fetchFeedbackByUserId(userId: number): Promise<{ posts: Feedback[]; total: number }> {
    const response = await fetch(`https://dummyjson.com/posts/user/${userId}`)
    if (!response.ok) throw new Error("Failed to fetch feedback")
    return response.json()
  }
  
  // Mock data generators for dashboard KPIs
  export function generateMockKPIs() {
    const statuses: Array<"scheduled" | "completed" | "no-show" | "pending"> = [
      "scheduled",
      "completed",
      "no-show",
      "pending",
    ]
  
    return {
      interviewsThisWeek: Math.floor(Math.random() * 20) + 15,
      averageFeedbackScore: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      noShows: Math.floor(Math.random() * 5) + 1,
      totalCandidates: Math.floor(Math.random() * 50) + 100,
      pendingFeedback: Math.floor(Math.random() * 10) + 5,
      completedInterviews: Math.floor(Math.random() * 30) + 40,
    }
  }
  
  export function assignRandomStatus(): "scheduled" | "completed" | "no-show" | "pending" {
    const statuses: Array<"scheduled" | "completed" | "no-show" | "pending"> = [
      "scheduled",
      "completed",
      "no-show",
      "pending",
    ]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }
  