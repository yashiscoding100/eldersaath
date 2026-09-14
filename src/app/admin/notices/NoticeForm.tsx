"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function NoticeForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      })

      if (res.ok) {
        setTitle("")
        setContent("")
        router.refresh()
      } else {
        alert("Failed to create notice")
      }
    } catch (e) {
      alert("Error creating notice")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-slate-900 mb-4">Create New Notice</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium text-slate-900"
            placeholder="e.g., Scheduled Maintenance"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
          <textarea
            required
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium text-slate-900 h-32 resize-none"
            placeholder="Enter the announcement..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Notice"}
        </button>
      </form>
    </div>
  )
}
