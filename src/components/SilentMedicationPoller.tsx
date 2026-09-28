"use client"
import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

export function SilentMedicationPoller() {
  const { data: session } = useSession()
  const hasRun = useRef(false)

  useEffect(() => {
    if (!session || session.user.role !== "ELDER") return

    const checkAlarms = async () => {
      try {
        await fetch("/api/cron", { method: "GET" })
      } catch (e) {
        // Silent
      }
    }

    // Run immediately on mount
    if (!hasRun.current) {
      checkAlarms()
      hasRun.current = true
    }

    // Then check every minute
    const interval = setInterval(checkAlarms, 60000)
    return () => clearInterval(interval)
  }, [session])

  return null
}
