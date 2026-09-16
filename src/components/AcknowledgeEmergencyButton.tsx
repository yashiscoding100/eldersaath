"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AcknowledgeEmergencyButton({ emergencyId }: { emergencyId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAcknowledge = async () => {
    setLoading(true)
    try {
      await fetch(`/api/sos/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergencyId })
      })
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleAcknowledge}
      disabled={loading}
      className="bg-red-900/50 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-900/70 transition border-2 border-red-400 whitespace-nowrap disabled:opacity-50"
    >
      {loading ? "Resolving..." : "Acknowledge & Resolve"}
    </button>
  )
}
