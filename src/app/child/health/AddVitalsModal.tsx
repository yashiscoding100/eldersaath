"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddVitalsModal({ elderId }: { elderId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [bp, setBp] = useState("")
  const [sugar, setSugar] = useState("")
  const [spo2, setSpo2] = useState("")
  const [pulse, setPulse] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/child/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, bp, sugar, spo2, pulse })
      })

      if (res.ok) {
        setOpen(false)
        setBp("")
        setSugar("")
        setSpo2("")
        setPulse("")
        router.refresh()
      } else {
        alert("Failed to save vitals")
      }
    } catch (err) {
      alert("Error saving vitals")
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition"
      >
        + Log Vitals
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Log Vitals</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">?</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Blood Pressure (mmHg)</label>
            <input type="text" placeholder="e.g. 120/80" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900" value={bp} onChange={e => setBp(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Blood Sugar (mg/dL)</label>
            <input type="text" placeholder="e.g. 95" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900" value={sugar} onChange={e => setSugar(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">SpO2 (%)</label>
              <input type="text" placeholder="e.g. 98" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900" value={spo2} onChange={e => setSpo2(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Pulse (BPM)</label>
              <input type="text" placeholder="e.g. 72" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900" value={pulse} onChange={e => setPulse(e.target.value)} />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 transition disabled:opacity-50">
            {loading ? "Saving..." : "Save Vitals"}
          </button>
        </form>
      </div>
    </div>
  )
}
