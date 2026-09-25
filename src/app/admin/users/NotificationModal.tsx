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
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await sendAdminNotification(targetUserId, title, body)
      alert(res.message)
      if (res.success) {
        setTitle("")
        setBody("")
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
            <label className="block text-sm font-bold text-slate-700">Notification Title</label>
            <input
              type="text"
              required
              placeholder="e.g. System Update"
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
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

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
