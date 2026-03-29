"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users, Medal, ChevronRight, Waves } from "lucide-react"
import type { UserRole } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const roles = [
  {
    id: "swimmer" as UserRole,
    title: "Swimmer",
    description: "Track your personal performance, log workouts, and analyze your progress",
    icon: Medal,
    color: "from-primary to-secondary",
  },
  {
    id: "parent" as UserRole,
    title: "Parent",
    description: "Monitor your children's swimming progress and manage their profiles",
    icon: Users,
    color: "from-secondary to-accent",
  },
  {
    id: "coach" as UserRole,
    title: "Coach",
    description: "Manage your team, track athletes, and access training tools",
    icon: User,
    color: "from-accent to-primary",
  },
]

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/onboarding?role=${selectedRole}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset scroll-bounce">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 pt-[calc(env(safe-area-inset-top)+3rem)] pb-8">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Waves className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent" />
        </div>
        <span className="text-2xl font-bold tracking-tight">SwimTrack</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">Welcome to SwimTrack</h1>
          <p className="text-muted-foreground text-balance">
            Sign in with the buttons above, then choose your role. Your data is saved to your account.
          </p>
        </div>

        <div className="space-y-3 mb-8 flex-1">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 border-2 press-scale",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-transparent bg-card hover:bg-muted/50"
                )}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br transition-all duration-200",
                        role.color,
                        isSelected ? "scale-110" : ""
                      )}
                    >
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{role.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl press-scale"
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continue
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Use the Sign in button in the top bar if you already have an account.
        </p>
      </div>
    </div>
  )
}
