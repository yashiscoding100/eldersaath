"use client"

import { useState, useEffect } from "react"
import { Bell, ShieldAlert, Pill, FileText } from "lucide-react"

export function PushNotificationSettings() {
  const [isOpen, setIsOpen] = useState(false)
  
  const [settings, setSettings] = useState({
    sosAlerts: true,
    medicationReminders: true,
    dailySummaries: false
  })

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("elderSaath_pushSettings")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    setSettings(newSettings)
    localStorage.setItem("elderSaath_pushSettings", JSON.stringify(newSettings))
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
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Daily Health Summaries</p>
              <p className="text-xs text-slate-500">Receive a morning digest of the previous day's vitals.</p>
            </div>
          </div>
          <button 
            onClick={() => handleToggle('dailySummaries')}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${settings.dailySummaries ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.dailySummaries ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

      </div>
    </div>
  )
}
