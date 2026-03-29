export type UserRole = "swimmer" | "parent" | "coach" | null
export type SubscriptionPlan = "free" | "pro" | "team"

export interface SwimLog {
  id: string
  date: string
  stroke: string
  distance: number
  time: string
  splits?: string[]
  notes?: string
}

export interface Swimmer {
  id: string
  name: string
  avatar?: string
  personalBests: {
    stroke: string
    distance: number
    time: string
  }[]
  logs: SwimLog[]
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  subscription: SubscriptionPlan
  avatar?: string
  children?: Swimmer[]
  athletes?: Swimmer[]
  swimmerProfile?: Swimmer
}
