"use client"

import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import { Home, Plus, BarChart3, User, Users } from "lucide-react"

export function BottomNav() {
  const { currentView, setCurrentView, user } = useApp()

  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "log-swim", icon: Plus, label: "Log" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "profile", icon: user?.role === "coach" ? Users : User, label: user?.role === "coach" ? "Team" : "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* iOS-style blur backdrop */}
      <div className="absolute inset-0 bg-card/80 backdrop-blur-xl border-t border-border" />
      
      {/* Safe area padding for iOS */}
      <div className="relative flex items-center justify-around h-20 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          const isLogButton = item.id === "log-swim"

          if (isLogButton) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="relative flex items-center justify-center -mt-4 touch-target press-scale"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all touch-target press-scale",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn(
                "w-6 h-6 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
