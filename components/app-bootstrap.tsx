"use client"

import { useAuth } from "@clerk/nextjs"
import { useEffect, useRef } from "react"
import { useApp } from "@/lib/app-context"
import { loadAppStateAction } from "@/lib/actions/app-data"

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const {
    setUser,
    setCurrentView,
    setSelectedChild,
    setSelectedAthlete,
  } = useApp()
  const prevUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (!isLoaded) return

    if (!userId) {
      if (prevUserId.current !== userId) {
        setUser(null)
        setCurrentView("onboarding")
        setSelectedChild(null)
        setSelectedAthlete(null)
      }
      prevUserId.current = userId
      return
    }

    prevUserId.current = userId
    let cancelled = false

    ;(async () => {
      const result = await loadAppStateAction()
      if (cancelled) return
      if (!result.ok) {
        return
      }
      if (result.user) {
        setUser(result.user)
        setCurrentView("dashboard")
        if (result.user.role === "parent" && result.user.children?.[0]) {
          setSelectedChild(result.user.children[0])
        } else {
          setSelectedChild(null)
        }
        if (result.user.role === "coach" && result.user.athletes?.[0]) {
          setSelectedAthlete(result.user.athletes[0])
        } else {
          setSelectedAthlete(null)
        }
      } else {
        setUser(null)
        setSelectedChild(null)
        setSelectedAthlete(null)
        setCurrentView("onboarding")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [
    isLoaded,
    userId,
    setUser,
    setCurrentView,
    setSelectedChild,
    setSelectedAthlete,
  ])

  return <>{children}</>
}
