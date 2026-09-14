"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateLinkModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [elderEmail, setElderEmail] = useState("")
  const [childEmail, setChildEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderEmail, childEmail })
      })

      const data = await res.json()

      if (res.ok) {
        setOpen(false)
        setElderEmail("")
        setChildEmail("")
        router.refresh()
      } else {
        setError(data.message || "Failed to create connection")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition"
      >
        + Force Create Connection
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Connection</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">?</button>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          As an Admin, you can force a connection between two accounts without requiring the Elder to approve it.
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Elder's Email</label>
            <input 
              type="email" 
              required
              placeholder="elder@example.com" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 outline-none focus:border-blue-500" 
              value={elderEmail} 
              onChange={e => setElderEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Family Member's Email (Child)</label>
            <input 
              type="email" 
              required
              placeholder="child@example.com" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 outline-none focus:border-blue-500" 
              value={childEmail} 
              onChange={e => setChildEmail(e.target.value)} 
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition disabled:opacity-50">
            {loading ? "Creating..." : "Create Link"}
          </button>
        </form>
      </div>
    </div>
  )
}
