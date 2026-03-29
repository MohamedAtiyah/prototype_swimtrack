"use client"

import { Suspense, useEffect } from "react"
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useApp, type UserRole } from "@/lib/app-context"
import { RoleSelection } from "@/components/onboarding/role-selection"
import { AccountSetup } from "@/components/onboarding/account-setup"

function isSetupRole(r: string | null): r is Exclude<UserRole, null> {
  return r === "swimmer" || r === "parent" || r === "coach"
}

function OnboardingContent() {
  const { isLoaded, userId } = useAuth()
  const { user, accountHydrated } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role")

  useEffect(() => {
    if (!isLoaded || !accountHydrated) return
    if (userId && user) {
      router.replace("/")
    }
  }, [isLoaded, accountHydrated, userId, user, router])

  if (!isLoaded || !accountHydrated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-background flex flex-col items-center justify-center px-6 pb-24">
        <p className="text-xl font-semibold text-center mb-2 text-balance">
          Continue to SwimTrack
        </p>
        <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm text-balance">
          Sign in or create an account first. You&apos;ll then pick swimmer, parent, or coach and
          complete your profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 w-full"
            >
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full"
            >
              Sign up
            </button>
          </SignUpButton>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground text-sm">
        Redirecting…
      </div>
    )
  }

  if (isSetupRole(role)) {
    return <AccountSetup role={role} />
  }

  return <RoleSelection />
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground text-sm">
          Loading…
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
