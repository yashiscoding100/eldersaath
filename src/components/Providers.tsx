"use client"

import { SessionProvider } from "next-auth/react"
import { ServiceWorkerRegister } from "./ServiceWorkerRegister"
import { SilentMedicationPoller } from "./SilentMedicationPoller"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ServiceWorkerRegister />
      <SilentMedicationPoller />
      {children}
    </SessionProvider>
  )
}
