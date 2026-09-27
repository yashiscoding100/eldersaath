"use client"

import { useState } from "react"
import { BellRing } from "lucide-react"
import { useRouter } from "next/navigation"

export function ElderAlarmSettings({ 
  elderId, 
  elderName,
  initialSnoozeText,
  initialSnoozeDuration 
}: { 
  elderId: string, 
  elderName: string,
  initialSnoozeText: string,
  initialSnoozeDuration: number
}) {
  const router = useRouter()
  const [snoozeText, setSnoozeText] = useState(initialSnoozeText)
  const [snoozeDuration, setSnoozeDuration] = useState(initialSnoozeDuration)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/child/elder-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, alarmSnoozeText: snoozeText, alarmSnoozeDuration: snoozeDuration })
      })
      alert("Elder Alarm Settings saved!")
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
        <h4 className="font-bold text-slate-900">{elderName}&apos;s Alarm Settings</h4>
      </div>
      
      <p className="text-sm text-slate-500 mb-2">Configure what happens when {elderName} snoozes an alarm on their device.</p>

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
      
      <div className="flex justify-end mt-2">
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