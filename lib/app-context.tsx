"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { User, Swimmer } from "./domain/types"

export type {
  UserRole,
  SubscriptionPlan,
  SwimLog,
  Swimmer,
  User,
} from "./domain/types"

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  currentView: string
  setCurrentView: (view: string) => void
  selectedChild: Swimmer | null
  setSelectedChild: (child: Swimmer | null) => void
  selectedAthlete: Swimmer | null
  setSelectedAthlete: (athlete: Swimmer | null) => void
  showPaywall: boolean
  setShowPaywall: (show: boolean) => void
  isPremiumFeature: (feature: string) => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState("onboarding")
  const [selectedChild, setSelectedChild] = useState<Swimmer | null>(null)
  const [selectedAthlete, setSelectedAthlete] = useState<Swimmer | null>(null)
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
        selectedAthlete,
        setSelectedAthlete,
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
