"use client"

import { AppProvider } from "@/lib/app-context"
import { AppBootstrap } from "@/components/app-bootstrap"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppBootstrap>{children}</AppBootstrap>
    </AppProvider>
  )
}
