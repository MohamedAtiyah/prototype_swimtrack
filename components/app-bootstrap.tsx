"use client"

import { useAuth } from "@clerk/nextjs"
import { useEffect, useRef } from "react"
import { useApp } from "@/lib/app-context"
import { loadAppStateAction } from "@/lib/actions/app-data"

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const {
    setUser,
    setSelectedChild,
    setSelectedAthlete,
    setAccountHydrated,
  } = useApp()
  const prevUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (!isLoaded) {
      setAccountHydrated(false)
      return
    }

    if (!userId) {
      if (prevUserId.current !== userId) {
        setUser(null)
        setSelectedChild(null)
        setSelectedAthlete(null)
      }
      prevUserId.current = userId
      setAccountHydrated(true)
      return
    }

    prevUserId.current = userId
    let cancelled = false
    setAccountHydrated(false)

    ;(async () => {
      const result = await loadAppStateAction()
      if (cancelled) return
      if (!result.ok) {
        setAccountHydrated(true)
        return
      }
      if (result.user) {
        setUser(result.user)
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
      }
      setAccountHydrated(true)
    })()

    return () => {
      cancelled = true
    }
  }, [
    isLoaded,
    userId,
    setUser,
    setSelectedChild,
    setSelectedAthlete,
    setAccountHydrated,
  ])

  return <>{children}</>
}
