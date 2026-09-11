"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function LinkParentButton({ variant = "small" }: { variant?: "small" | "large" }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleLink = async () => {
    if (!email) return
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setMessage(data.message || "Failed to link")
      } else {
        setMessage("Successfully linked!")
        router.refresh()
      }
    } catch (e) {
      setMessage("An error occurred")
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (variant === "large") {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-2 justify-center w-full">
          <input 
            type="email" 
            placeholder="Parent's email address" 
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            onClick={handleLink}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Linking..." : "Link Parent Account"}
          </button>
        </div>
        {message && <p className={`mt-2 text-sm w-full text-center ${message.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-end">
      <div className="flex gap-2">
        <input 
          type="email" 
          placeholder="Parent's email address" 
          className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 w-48"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          onClick={handleLink}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "..." : "+ Link Parent"}
        </button>
      </div>
      {message && <p className={`absolute top-full mt-2 right-0 bg-white p-2 shadow-lg rounded border z-10 text-sm ${message.includes('Success') ? 'text-green-600 border-green-200' : 'text-red-500 border-red-200'}`}>{message}</p>}
    </div>
  )
}
