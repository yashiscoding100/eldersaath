"use client"
import { useState } from "react"

export function ElderAlarmPreferences({ initialSticky }: { initialSticky: boolean }) {
  const [sticky, setSticky] = useState(initialSticky)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    const nextVal = !sticky
    setSticky(nextVal)
    setLoading(true)
    try {
      await fetch("/api/elder/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stickyAlarmNotification: nextVal })
      })
    } catch(e) {}
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h4 className="font-bold text-slate-900 mb-4">Alarm Preferences</h4>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-700 text-sm">Sticky Alarm Notification</p>
          <p className="text-xs text-slate-500">Show a persistent tray notification during full-screen alarms.</p>
        </div>
        <button 
          onClick={toggle}
          disabled={loading}
          className={"w-12 h-6 rounded-full relative transition-colors " + (sticky ? 'bg-blue-600' : 'bg-slate-300')}
        >
          <span className={"absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform " + (sticky ? 'translate-x-6' : 'translate-x-0')} />
        </button>
      </div>
    </div>
  )
}