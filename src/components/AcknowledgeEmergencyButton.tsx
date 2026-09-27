
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export function AcknowledgeEmergencyButton({ emergencyId }: { emergencyId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const handleAcknowledge = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sos/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergencyId })
      })
      if (!res.ok) {
        alert("Failed to resolve. Are you logged in as Caretaker?")
        setLoading(false)
        return
      }
      
      window.location.reload()
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleAcknowledge}
      disabled={loading || isPending}
      className="bg-red-900/50 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-900/70 transition border-2 border-red-400 whitespace-nowrap disabled:opacity-50"
    >
      {(loading || isPending) ? "Resolving..." : "Acknowledge & Resolve"}
    </button>
  )
}
