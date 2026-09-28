
"use client"

import { useState } from "react"
import { BellRing, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"

export function ElderAlarmSettings({ 
  elderId, 
  elderName,
  initialSnoozeText,
  initialSnoozeDuration,
  initialSosEnabled, initialCanManageMeds
}: { 
  elderId: string, 
  elderName: string,
  initialSnoozeText: string,
  initialSnoozeDuration: number,
  initialSosEnabled: boolean,
  initialCanManageMeds: boolean
}) {
  const router = useRouter()
  const [snoozeText, setSnoozeText] = useState(initialSnoozeText)
  const [snoozeDuration, setSnoozeDuration] = useState(initialSnoozeDuration)
  const [sosEnabled, setSosEnabled] = useState(initialSosEnabled)
  const [canManageMeds, setCanManageMeds] = useState(initialCanManageMeds)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/child/elder-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, alarmSnoozeText: snoozeText, alarmSnoozeDuration: snoozeDuration, sosEnabled, canManageMeds })
      })
      alert("Elder Settings saved!")
      router.refresh()
    } catch (e) {
      alert("Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 bg-white flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <BellRing className="w-5 h-5 text-red-500" />
        <h4 className="font-bold text-slate-900">{elderName}&apos;s Settings</h4>
      </div>
      
      <p className="text-sm text-slate-500 mb-2">Configure alarms and safety features for {elderName}&apos;s device.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Snooze Button Text</label>
          <input 
            type="text" 
            className="w-full border border-slate-200 p-2 rounded-lg font-medium focus:border-blue-500 outline-none" 
            value={snoozeText} 
            onChange={e => setSnoozeText(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Snooze Duration (minutes)</label>
          <input 
            type="number" 
            min="1"
            className="w-full border border-slate-200 p-2 rounded-lg font-medium focus:border-blue-500 outline-none" 
            value={snoozeDuration} 
            onChange={e => setSnoozeDuration(Number(e.target.value))} 
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" /> 
            Enable SOS Emergency Button
          </h4>
          <p className="text-sm text-slate-500 mt-1">Shows a large red SOS button on their home screen.</p>
        </div>
        <button
          onClick={() => setSosEnabled(!sosEnabled)}
          className={`w-12 h-6 rounded-full relative transition-colors ${sosEnabled ? "bg-red-500" : "bg-slate-300"}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${sosEnabled ? "left-6" : "left-0.5"}`} />
        </button>
      </div>
      
      
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="pr-4">
            <h4 className="font-bold text-slate-900 text-sm">Allow Elder to Manage Meds</h4>
            <p className="text-sm text-slate-500 mt-1">Allows the elder to add or delete their own medicines.</p>
          </div>
          <button
            onClick={() => setCanManageMeds(!canManageMeds)}
            className={`w-12 h-6 rounded-full relative transition-colors ${canManageMeds ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${canManageMeds ? "left-6" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex justify-end mt-4">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
