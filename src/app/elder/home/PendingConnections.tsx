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
    <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-50 border-4 border-indigo-100 rounded-[2.5rem] p-6 mb-6 shadow-lg shadow-indigo-900/5">
      <h3 className="text-2xl font-black text-indigo-950 mb-4 flex items-center">
        <span className="text-4xl mr-3">👋</span> New Request!
      </h3>
      <div className="space-y-4">
        {pending.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-[2rem] border-4 border-indigo-50 flex flex-col gap-5 shadow-sm">
            <div>
              <p className="font-black text-gray-900 text-2xl">{req.child.name || "A family member"}</p>
              <p className="text-gray-600 font-bold text-lg mt-1">wants to connect</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleAction(req.id, "APPROVE")}
                className="w-full bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-black text-2xl py-5 rounded-[1.5rem] transition-all transform active:scale-95 shadow-md border-4 border-indigo-800"
              >
                ✅ Allow Access
              </button>
              <button 
                onClick={() => handleAction(req.id, "REJECT")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xl py-4 rounded-[1.5rem] transition-all transform active:scale-95 border-4 border-gray-200"
              >
                ❌ Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
