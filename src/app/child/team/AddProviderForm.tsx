"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"

export function AddProviderForm({ elderId }: { elderId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !role) return
    
    setLoading(true)
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, name, role, phone })
      })

      if (res.ok) {
        setIsOpen(false)
        setName("")
        setRole("")
        setPhone("")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 flex items-center justify-center gap-2 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Team Member
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-900">New Team Member</h3>
        <button type="button" onClick={() => setIsOpen(false)} className="text-sm text-slate-400 hover:text-slate-600">Cancel</button>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
        <input 
          required 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. Maria"
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role / Job</label>
          <input 
            required 
            type="text" 
            value={role} 
            onChange={e => setRole(e.target.value)} 
            placeholder="e.g. Maid, Nurse"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone (Optional)</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="+1 234 567 890"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading || !name || !role}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Member"}
      </button>
    </form>
  )
}
