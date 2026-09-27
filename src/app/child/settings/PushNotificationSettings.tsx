"use client"

import { useState, useEffect } from "react"
import { Bell, ShieldAlert, Pill, FileText } from "lucide-react"

export function PushNotificationSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [settings, setSettings] = useState({
    sosAlerts: true,
    medicationReminders: true,
    notifyVitals: true // Loaded from DB
  })

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("elderSaath_pushSettings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(s => ({ ...s, sosAlerts: parsed.sosAlerts ?? true, medicationReminders: parsed.medicationReminders ?? true }))
      } catch (e) {
        // ignore
      }
    }
    
    // Fetch server settings
    fetch("/api/user/notifications")
      .then(res => res.json())
      .then(data => {
        setSettings(s => ({ ...s, notifyVitals: data.notifyVitals }))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key]
    setSettings(s => ({ ...s, [key]: newValue }))
    
    if (key === 'notifyVitals') {
      try {
        await fetch("/api/user/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notifyVitals: newValue })
        })
      } catch (e) {
        console.error("Failed to save to DB", e)
      }
    } else {
      const saved = localStorage.getItem("elderSaath_pushSettings")
      let current = {}
      try { current = saved ? JSON.parse(saved) : {} } catch(e){}
      localStorage.setItem("elderSaath_pushSettings", JSON.stringify({ ...current, [key]: newValue }))
    }
  }

  if (!isOpen) {
    return (
      <div className="p-6 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900">Push Notifications</h4>
          <p className="text-sm text-slate-500 mt-1">Receive alerts for SOS and medication reminders.</p>
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
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notification Preferences
        </h4>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
        >
          Close
        </button>
      </div>

      <div className="space-y-4 max-w-lg">
        {/* Toggle Item */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">SOS & Emergency Alerts</p>
              <p className="text-xs text-slate-500">Critical alerts when emergency contacts are triggered.</p>
            </div>
          </div>
          <button 
            onClick={() => handleToggle('sosAlerts')}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${settings.sosAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.sosAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle Item */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Medication Reminders</p>
              <p className="text-xs text-slate-500">Get notified when a dose is missed or scheduled.</p>
            </div>
          </div>
          <button 
            onClick={() => handleToggle('medicationReminders')}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${settings.medicationReminders ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.medicationReminders ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle Item */}
        <div className={`flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Real-time Vitals Alerts</p>
              <p className="text-xs text-slate-500">Get instantly notified the moment your elder logs their daily vitals.</p>
            </div>
          </div>
          <button 
            disabled={loading}
            onClick={() => handleToggle('notifyVitals')}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${settings.notifyVitals ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.notifyVitals ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

      </div>
    </div>
  )
}
