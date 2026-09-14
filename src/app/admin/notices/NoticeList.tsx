"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Notice = {
  id: string
  title: string
  content: string
  isActive: boolean
  createdAt: Date
}

export function NoticeList({ initialNotices }: { initialNotices: Notice[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return
    
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete notice")
      }
    } catch (e) {
      alert("Error deleting notice")
    } finally {
      setLoadingId(null)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to update notice")
      }
    } catch (e) {
      alert("Error updating notice")
    } finally {
      setLoadingId(null)
    }
  }

  if (initialNotices.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 font-medium">No notices published yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {initialNotices.map(notice => (
        <div key={notice.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${notice.isActive ? 'border-blue-200 ring-1 ring-blue-500/10' : 'border-slate-200 opacity-70'} transition`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-900">{notice.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${notice.isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {notice.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <p className="text-slate-600 mb-4">{notice.content}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{new Date(notice.createdAt).toLocaleString()}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleToggle(notice.id, notice.isActive)}
                disabled={loadingId === notice.id}
                className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md font-bold transition disabled:opacity-50"
              >
                {notice.isActive ? "Deactivate" : "Activate"}
              </button>
              <button 
                onClick={() => handleDelete(notice.id)}
                disabled={loadingId === notice.id}
                className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md font-bold transition disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
