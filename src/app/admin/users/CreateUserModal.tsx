"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateUserModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("ELDER") // Default to ELDER

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await res.json()

      if (res.ok) {
        setOpen(false)
        setName("")
        setEmail("")
        setPassword("")
        setRole("ELDER")
        router.refresh()
      } else {
        setError(data.message || "Failed to create account")
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
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition flex items-center gap-2"
      >
        <span>+</span> Create Account
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Account</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">?</button>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Manually onboard a user. You can set their role and initial password here.
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="John Doe" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 outline-none focus:border-blue-500" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="john@example.com" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 outline-none focus:border-blue-500" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Initial Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 outline-none focus:border-blue-500" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Account Role</label>
            <select 
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 outline-none focus:border-blue-500"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="ELDER">Elder (Patient)</option>
              <option value="CHILD">Family Member (Child)</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}
