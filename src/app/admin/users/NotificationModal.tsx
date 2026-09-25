"use client"

import { useState } from "react"
import { sendAdminNotification } from "../actions"

type NotificationModalProps = {
  isOpen: boolean
  onClose: () => void
  targetUserId: string | "ALL"
  targetUserName?: string | null
}

export function NotificationModal({ isOpen, onClose, targetUserId, targetUserName }: NotificationModalProps) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isAlarm, setIsAlarm] = useState(false)
  const [snoozeDuration, setSnoozeDuration] = useState(10)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await sendAdminNotification(targetUserId, title, body, isAlarm, snoozeDuration)
      alert(res.message)
      if (res.success) {
        setTitle("")
        setBody("")
        setIsAlarm(false)
        setSnoozeDuration(10)
        onClose()
      }
    } catch (err: any) {
      alert(err.message || "Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  const isBroadcast = targetUserId === "ALL"

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isBroadcast ? "Broadcast Notification" : "Send Personal Notification"}
            </h3>
            <p className="text-sm font-medium text-slate-500">
              {isBroadcast ? "Send to all registered devices" : `Sending to ${targetUserName || "User"}`}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Notification Title / Label</label>
            <input
              type="text"
              required
              placeholder="e.g. Take your medicine!"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Message Body</label>
            <textarea
              required
              placeholder="Enter your message here..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="text-sm font-bold text-red-700">Send as Full-Screen Alarm?</p>
              <p className="text-xs text-red-600/80">Forces phone to ring loudly and display snooze controls.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isAlarm} onChange={(e) => setIsAlarm(e.target.checked)} />
              <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {isAlarm && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-700">Snooze Duration (Minutes)</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                value={snoozeDuration}
                onChange={(e) => setSnoozeDuration(Number(e.target.value))}
              >
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
              </select>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title || !body}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition shadow-md shadow-blue-600/20"
            >
              {loading ? "Sending..." : (
                <>
                  <span>🔔</span> Send Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
