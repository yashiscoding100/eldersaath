
"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

export function ElderPushSettings() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <div className="p-6 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900">Push Notifications</h4>
          <p className="text-sm text-slate-500 mt-1">Manage alarms and alerts on this device.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700 text-sm hover:bg-slate-100 transition shrink-0"
        >
          View Settings
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notification Settings
        </h4>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
        >
          Close
        </button>
      </div>

      <div className="space-y-4 max-w-lg">
        <p className="text-sm text-slate-700 font-medium">
          Because this app handles critical medication alarms and emergency SOS alerts, push notifications cannot be disabled from within the app.
        </p>
        <p className="text-sm text-slate-500">
          If you wish to completely mute all alerts, you must do so from your Android system settings:
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-2 font-medium">
            <li>Open your phone's <strong>Settings</strong> app</li>
            <li>Tap <strong>Apps</strong></li>
            <li>Select <strong>Elder Saath</strong></li>
            <li>Tap <strong>Notifications</strong> and toggle them off.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
