"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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
  children?: Swimmer[] // For parents
  athletes?: Swimmer[] // For coaches
  swimmerProfile?: Swimmer // For swimmers
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  currentView: string
  setCurrentView: (view: string) => void
  selectedChild: Swimmer | null
  setSelectedChild: (child: Swimmer | null) => void
  showPaywall: boolean
  setShowPaywall: (show: boolean) => void
  isPremiumFeature: (feature: string) => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Demo data for development
const demoSwimmerProfile: Swimmer = {
  id: "swimmer-1",
  name: "Alex Johnson",
  personalBests: [
    { stroke: "Freestyle", distance: 50, time: "24.32" },
    { stroke: "Freestyle", distance: 100, time: "52.15" },
    { stroke: "Backstroke", distance: 50, time: "28.41" },
    { stroke: "Butterfly", distance: 50, time: "26.89" },
    { stroke: "Breaststroke", distance: 100, time: "1:12.45" },
  ],
  logs: [
    { id: "1", date: "2026-03-28", stroke: "Freestyle", distance: 100, time: "52.34", splits: ["25.12", "27.22"] },
    { id: "2", date: "2026-03-26", stroke: "Backstroke", distance: 50, time: "28.56" },
    { id: "3", date: "2026-03-24", stroke: "Butterfly", distance: 50, time: "27.12" },
    { id: "4", date: "2026-03-22", stroke: "Freestyle", distance: 200, time: "1:58.45", splits: ["28.12", "30.22", "30.45", "29.66"] },
    { id: "5", date: "2026-03-20", stroke: "IM", distance: 200, time: "2:15.34" },
  ]
}

const demoChildren: Swimmer[] = [
  {
    id: "child-1",
    name: "Emma Wilson",
    avatar: "",
    personalBests: [
      { stroke: "Freestyle", distance: 50, time: "28.45" },
      { stroke: "Backstroke", distance: 50, time: "32.12" },
    ],
    logs: [
      { id: "c1-1", date: "2026-03-28", stroke: "Freestyle", distance: 50, time: "28.67" },
      { id: "c1-2", date: "2026-03-25", stroke: "Backstroke", distance: 50, time: "32.45" },
    ]
  },
  {
    id: "child-2",
    name: "Jake Wilson",
    avatar: "",
    personalBests: [
      { stroke: "Freestyle", distance: 50, time: "26.78" },
      { stroke: "Butterfly", distance: 50, time: "29.34" },
    ],
    logs: [
      { id: "c2-1", date: "2026-03-27", stroke: "Freestyle", distance: 50, time: "27.12" },
      { id: "c2-2", date: "2026-03-24", stroke: "Butterfly", distance: 50, time: "29.89" },
    ]
  }
]

const demoAthletes: Swimmer[] = [
  demoSwimmerProfile,
  ...demoChildren,
  {
    id: "athlete-3",
    name: "Sarah Chen",
    personalBests: [
      { stroke: "Breaststroke", distance: 100, time: "1:08.23" },
      { stroke: "IM", distance: 200, time: "2:12.45" },
    ],
    logs: [
      { id: "a3-1", date: "2026-03-28", stroke: "Breaststroke", distance: 100, time: "1:08.56" },
    ]
  },
  {
    id: "athlete-4",
    name: "Marcus Lee",
    personalBests: [
      { stroke: "Freestyle", distance: 100, time: "50.23" },
      { stroke: "Butterfly", distance: 100, time: "55.67" },
    ],
    logs: [
      { id: "a4-1", date: "2026-03-27", stroke: "Freestyle", distance: 100, time: "50.89" },
    ]
  }
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState("onboarding")
  const [selectedChild, setSelectedChild] = useState<Swimmer | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)

  const isPremiumFeature = (feature: string): boolean => {
    if (!user) return true
    const freeFeatures = ["basic_logs", "basic_stats", "single_profile"]
    if (user.subscription === "free") {
      return !freeFeatures.includes(feature)
    }
    return false
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentView,
        setCurrentView,
        selectedChild,
        setSelectedChild,
        showPaywall,
        setShowPaywall,
        isPremiumFeature,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export { demoSwimmerProfile, demoChildren, demoAthletes }
