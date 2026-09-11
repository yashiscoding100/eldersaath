"use client"

import { SessionProvider } from "next-auth/react"
import { AlarmSystem } from "./AlarmSystem"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AlarmSystem />
      {children}
    </SessionProvider>
  )
}
