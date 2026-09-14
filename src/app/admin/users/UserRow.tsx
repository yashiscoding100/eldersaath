"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: Date
}

export function UserRow({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.email}? This cannot be undone.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete user")
      }
    } catch (e) {
      alert("Error deleting user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="p-4 font-bold text-slate-900">{user.name || "—"}</td>
      <td className="p-4 text-slate-600">{user.email}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
          user.role === 'ELDER' ? 'bg-blue-100 text-blue-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="p-4 text-slate-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="p-4 text-right">
        {user.role !== "ADMIN" && (
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        )}
      </td>
    </tr>
  )
}
