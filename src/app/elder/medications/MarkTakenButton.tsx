"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function MarkTakenButton({ medicationId }: { medicationId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "taken">("idle")

  const handleMark = async () => {
    setStatus("loading")
    try {
      await fetch("/api/medications/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicationId, status: "TAKEN" }),
      })
      setStatus("taken")
      router.refresh()
    } catch {
      setStatus("idle")
    }
  }

  if (status === "taken") {
    return (
      <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-3xl text-green-600">
        ✓
      </div>
    )
  }

  return (
    <button
      onClick={handleMark}
      disabled={status === "loading"}
      className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl hover:bg-green-100 hover:text-green-600 transition-colors disabled:opacity-50"
    >
      {status === "loading" ? "..." : "○"}
    </button>
  )
}
