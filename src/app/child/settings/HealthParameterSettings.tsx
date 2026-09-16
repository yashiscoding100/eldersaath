"use client"

import { useState } from "react"
import { Activity } from "lucide-react"

type Props = {
  elderId: string
  elderName: string
  initialVitals: string // e.g., "BP,SUGAR,SPO2,PULSE,TEMP,WEIGHT"
}

const AVAILABLE_VITALS = [
  { id: "BP", label: "Blood Pressure" },
  { id: "SUGAR", label: "Blood Sugar" },
  { id: "SPO2", label: "Oxygen (SpO2)" },
  { id: "PULSE", label: "Heart Rate" },
  { id: "TEMP", label: "Temperature" },
  { id: "WEIGHT", label: "Weight" },
]

export function HealthParameterSettings({ elderId, elderName, initialVitals }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeVitals, setActiveVitals] = useState<string[]>(initialVitals.split(","))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const toggleVital = (id: string) => {
    if (activeVitals.includes(id)) {
      setActiveVitals(activeVitals.filter(v => v !== id))
    } else {
      setActiveVitals([...activeVitals, id])
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/elder/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, requiredVitals: activeVitals.join(",") })
      })

      if (res.ok) {
        setMessage("Settings saved successfully!")
        setTimeout(() => setIsOpen(false), 2000)
      } else {
        setMessage("Failed to save settings.")
      }
    } catch (e) {
      setMessage("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="p-6 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Daily Health Parameters
          </h4>
          <p className="text-sm text-slate-500 mt-1">Configure which vitals {elderName} needs to check daily.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700 text-sm hover:bg-slate-100 transition shrink-0"
        >
          Configure
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Health Parameters for {elderName}
          </h4>
          <p className="text-sm text-slate-500 mt-1">Select the vitals that should appear on the elder's daily check-in screen.</p>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
        >
          Close
        </button>
      </div>

      <div className="max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:divide-solid divide-slate-100 border-b border-slate-100">
          {AVAILABLE_VITALS.slice(0, 2).map((vital) => (
            <div key={vital.id} className="p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{vital.label}</span>
              <button 
                onClick={() => toggleVital(vital.id)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${activeVitals.includes(vital.id) ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${activeVitals.includes(vital.id) ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:divide-solid divide-slate-100 border-b border-slate-100">
          {AVAILABLE_VITALS.slice(2, 4).map((vital) => (
            <div key={vital.id} className="p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{vital.label}</span>
              <button 
                onClick={() => toggleVital(vital.id)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${activeVitals.includes(vital.id) ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${activeVitals.includes(vital.id) ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:divide-solid divide-slate-100">
          {AVAILABLE_VITALS.slice(4, 6).map((vital) => (
            <div key={vital.id} className="p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{vital.label}</span>
              <button 
                onClick={() => toggleVital(vital.id)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${activeVitals.includes(vital.id) ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${activeVitals.includes(vital.id) ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
        {message && (
          <p className={`text-sm font-semibold ${message.includes('successfully') ? 'text-emerald-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
