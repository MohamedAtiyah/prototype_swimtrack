"use client"

import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { SwimmerDashboard } from "@/components/dashboards/swimmer-dashboard"
import { ParentDashboard } from "@/components/dashboards/parent-dashboard"
import { CoachDashboard } from "@/components/dashboards/coach-dashboard"
import { SwimLogging } from "@/components/swim-logging"
import { Analytics } from "@/components/analytics"
import { Pricing } from "@/components/subscription/pricing"
import { ProfileManagement } from "@/components/profile-management"
import { EditProfile } from "@/components/edit-profile"
import { Paywall } from "@/components/subscription/paywall"

const SETUP_VIEWS = new Set([
  "onboarding",
  "setup-swimmer",
  "setup-parent",
  "setup-coach",
])

function HomeGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const { user, accountHydrated, currentView, setCurrentView } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !accountHydrated) return
    if (!userId || !user) {
      router.replace("/onboarding")
    }
  }, [isLoaded, accountHydrated, userId, user, router])

  useEffect(() => {
    if (!user) return
    if (SETUP_VIEWS.has(currentView)) {
      setCurrentView("dashboard")
    }
  }, [user, currentView, setCurrentView])

  if (!isLoaded || !accountHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm bg-background">
        Loading…
      </div>
    )
  }

  if (userId && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm bg-background">
        Redirecting…
      </div>
    )
  }

  return <>{children}</>
}

function AppContent() {
  const { currentView, user, showPaywall } = useApp()

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        if (user?.role === "swimmer") return <SwimmerDashboard />
        if (user?.role === "parent") return <ParentDashboard />
        if (user?.role === "coach") return <CoachDashboard />
        return null
      case "log-swim":
        return <SwimLogging />
      case "analytics":
        return <Analytics />
      case "pricing":
        return <Pricing />
      case "profile":
        return <ProfileManagement />
      case "edit-profile":
        return <EditProfile />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderView()}
      {showPaywall && <Paywall />}
    </div>
  )
}

export default function Home() {
  return (
    <HomeGate>
      <AppContent />
    </HomeGate>
  )
}
