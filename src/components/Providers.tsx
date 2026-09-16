"use client"

import { SessionProvider } from "next-auth/react"
import { AlarmSystem } from "./AlarmSystem"
import { ServiceWorkerRegister } from "./ServiceWorkerRegister"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ServiceWorkerRegister />
      <AlarmSystem />
      {children}
    </SessionProvider>
  )
}
