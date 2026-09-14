"use client"

import { useState } from "react"

type PendingRequest = {
  id: string
  child: { name: string | null; email: string | null }
}

export function PendingConnections({ requests }: { requests: PendingRequest[] }) {
  const [pending, setPending] = useState(requests)

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/link/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationshipId: id, action })
      })

      if (res.ok) {
        setPending(prev => prev.filter(r => r.id !== id))
      } else {
        alert("Failed to process request")
      }
    } catch (e) {
      alert("Error processing request")
    }
  }

  if (pending.length === 0) return null

  return (
    <div className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 mb-4 shadow-sm">
      <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center">
        <span className="text-2xl mr-2">👋</span> New Connection Requests
      </h3>
      <div className="space-y-3">
        {pending.map(req => (
          <div key={req.id} className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-col gap-3">
            <div>
              <p className="font-bold text-gray-900 text-lg">{req.child.name || "A family member"}</p>
              <p className="text-gray-500">{req.child.email}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(req.id, "APPROVE")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition"
              >
                Allow Access
              </button>
              <button 
                onClick={() => handleAction(req.id, "REJECT")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition"
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
