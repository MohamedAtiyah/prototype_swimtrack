"use client"

import { AppProvider, useApp } from "@/lib/app-context"
import { RoleSelection } from "@/components/onboarding/role-selection"
import { AccountSetup } from "@/components/onboarding/account-setup"
import { SwimmerDashboard } from "@/components/dashboards/swimmer-dashboard"
import { ParentDashboard } from "@/components/dashboards/parent-dashboard"
import { CoachDashboard } from "@/components/dashboards/coach-dashboard"
import { SwimLogging } from "@/components/swim-logging"
import { Analytics } from "@/components/analytics"
import { Pricing } from "@/components/subscription/pricing"
import { ProfileManagement } from "@/components/profile-management"
import { EditProfile } from "@/components/edit-profile"
import { Paywall } from "@/components/subscription/paywall"
import { AppBootstrap } from "@/components/app-bootstrap"

function AppContent() {
  const { currentView, user, showPaywall } = useApp()

  const renderView = () => {
    switch (currentView) {
      case "onboarding":
        return <RoleSelection />
      case "setup-swimmer":
        return <AccountSetup role="swimmer" />
      case "setup-parent":
        return <AccountSetup role="parent" />
      case "setup-coach":
        return <AccountSetup role="coach" />
      case "dashboard":
        if (user?.role === "swimmer") return <SwimmerDashboard />
        if (user?.role === "parent") return <ParentDashboard />
        if (user?.role === "coach") return <CoachDashboard />
        return <RoleSelection />
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
        return <RoleSelection />
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
    <AppProvider>
      <AppBootstrap>
        <AppContent />
      </AppBootstrap>
    </AppProvider>
  )
}
