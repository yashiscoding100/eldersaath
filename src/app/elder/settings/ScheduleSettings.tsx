"use client"

import { useState } from "react"
import { CalendarClock, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ScheduleSettings({ initialDays }: { initialDays: string }) {
  const router = useRouter()
  // "0" is Sunday, "1" is Monday, etc.
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialDays.split(",").map(d => parseInt(d)).filter(n => !isNaN(n))
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const DAYS = [
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
    { id: 0, label: "Sunday" }
  ]

  const toggleDay = (id: number) => {
    if (selectedDays.includes(id)) {
      setSelectedDays(selectedDays.filter(d => d !== id))
    } else {
      setSelectedDays([...selectedDays, id])
    }
    setMessage("")
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/elder/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vitalCheckDays: selectedDays.join(",") })
      })

      if (!res.ok) throw new Error("Failed to save")
      
      setMessage("Schedule updated successfully!")
      router.refresh()
    } catch (e) {
      setMessage("Error saving settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <CalendarClock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Health Check Schedule</h2>
          <p className="text-sm text-slate-500">Select which days you need to record your vitals.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {DAYS.map(day => {
          const isSelected = selectedDays.includes(day.id)
          return (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isSelected 
                  ? "bg-blue-50 border-blue-600 text-blue-800" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              <span className="font-medium text-sm md:text-base">{day.label}</span>
              {isSelected && <Check className="w-4 h-4 text-blue-600" />}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Schedule
        </button>
        {message && (
          <p className={`text-sm font-bold ${message.includes("Error") ? "text-red-600" : "text-emerald-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
