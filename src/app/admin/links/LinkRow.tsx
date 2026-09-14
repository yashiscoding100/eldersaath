"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type LinkData = {
  id: string
  status: string
  createdAt: Date
  elder: { name: string | null; email: string | null }
  child: { name: string | null; email: string | null }
}

export function LinkRow({ link }: { link: LinkData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Sever connection between ${link.elder.name} and ${link.child.name}?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/links?id=${link.id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete connection")
      }
    } catch (e) {
      alert("Error deleting connection")
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="p-4">
        <p className="font-bold text-slate-900">{link.elder.name || "—"}</p>
        <p className="text-xs text-slate-500">{link.elder.email}</p>
      </td>
      <td className="p-4">
        <p className="font-bold text-slate-900">{link.child.name || "—"}</p>
        <p className="text-xs text-slate-500">{link.child.email}</p>
      </td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          link.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {link.status}
        </span>
      </td>
      <td className="p-4 text-slate-500 text-sm">{new Date(link.createdAt).toLocaleDateString()}</td>
      <td className="p-4 text-right">
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Sever Link"}
        </button>
      </td>
    </tr>
  )
}
