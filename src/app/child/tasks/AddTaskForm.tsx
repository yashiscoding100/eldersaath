import { convertTo12Hour } from '@/lib/timeUtils'
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddTaskForm({ elderId }: { elderId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [triggerAlarm, setTriggerAlarm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, title, description, time: convertTo12Hour(time), triggerAlarm })
      })
      setIsOpen(false)
      setTitle("")
      setDescription("")
      setTime("")
      setTriggerAlarm(false)
      router.refresh()
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
        className="w-full bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition block text-left"
      >
        <p className="text-sm text-purple-500">Tasks</p>
        <p className="font-bold text-purple-700">+ Add Task →</p>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Daily Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Title</label>
            <input required type="text" placeholder="e.g. Call your grandson" className="text-gray-900 font-bold w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <input type="text" className="text-gray-900 font-bold w-full border p-2 rounded" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          
          
          <div>
            <label className="block text-sm font-medium mb-1">Time (Optional)</label>
            <input type="time" className="text-gray-900 font-bold w-full border p-2 rounded" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setTriggerAlarm(!triggerAlarm)}
              className={`w-12 h-6 rounded-full relative transition-colors ${triggerAlarm ? 'bg-red-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${triggerAlarm ? 'left-6' : 'left-0.5'}`} />
            </button>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Important Task (Trigger Alarm)</p>
              <p className="text-xs text-slate-500">Will sound a loud full-screen alarm on their device.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
