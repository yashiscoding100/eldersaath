"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EditUserModal } from "./EditUserModal"

type User = {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: Date
  isBlocked?: boolean
  blockMessage?: string | null
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

  const handleBlockToggle = async () => {
    let blockMessage = null;
    
    if (!user.isBlocked) {
      blockMessage = prompt("Enter a message to show the user (e.g., 'Subscription Overdue'):")
      if (blockMessage === null) return // User cancelled
    } else {
      if (!confirm(`Are you sure you want to unblock ${user.email}?`)) return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, isBlocked: !user.isBlocked, blockMessage })
      })
      if (res.ok) {
        router.refresh()
      } else {
        const errData = await res.json().catch(() => ({}))
        alert(`Failed to update block status: ${errData.message || res.statusText}`)
      }
    } catch (e) {
      alert("Error updating user: " + String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="p-4 font-bold text-slate-900">
        {user.name || "—"}
        {user.isBlocked && <span className="ml-2 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">Blocked</span>}
      </td>
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
      <td className="p-4 text-right flex justify-end gap-2 items-center">
        {user.role !== "ADMIN" && (
          <>
            <EditUserModal user={user} />
            <button 
              onClick={handleBlockToggle}
              disabled={loading}
              className={`font-bold text-sm px-3 py-1 rounded-md transition disabled:opacity-50 ${
                user.isBlocked ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {loading ? "..." : user.isBlocked ? "Unblock" : "Block"}
            </button>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition disabled:opacity-50"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  )
}

