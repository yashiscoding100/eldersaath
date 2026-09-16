"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type EditProfileProps = {
  initialName: string
  initialEmail: string
}

export function EditProfileForm({ initialName, initialEmail }: EditProfileProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || "Failed to update profile")
      } else {
        setMessage("Profile updated successfully")
        setIsEditing(false)
        router.refresh()
      }
    } catch (error) {
      setMessage("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900">Profile Information</h4>
          <p className="text-sm text-slate-500 mt-1">Name: {initialName}</p>
          <p className="text-sm text-slate-500">Email: {initialEmail}</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700 text-sm hover:bg-slate-100 transition shrink-0"
        >
          Edit Profile
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50">
      <h4 className="font-bold text-slate-900 mb-4">Edit Profile</h4>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {message && (
          <p className={`text-sm ${message.includes('successfully') ? 'text-emerald-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <div className="flex gap-3 pt-2">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button 
            onClick={() => {
              setIsEditing(false)
              setName(initialName)
              setEmail(initialEmail)
              setMessage("")
            }}
            disabled={loading}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md font-semibold text-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
