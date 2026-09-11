"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CHILD", // Default
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        let errorMsg = "Registration failed"
        try {
          const data = await res.json()
          errorMsg = data.message || errorMsg
        } catch {
          // Response was not JSON
        }
        throw new Error(errorMsg)
      }

      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Elder Saath</h1>
          <p className="text-gray-700 mt-2 font-medium">Because distance shouldn't mean less care.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-400 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-400 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-400 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">I am signing up as:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center transition-colors font-bold ${
                  formData.role === "CHILD"
                    ? "border-blue-600 bg-blue-100 text-blue-900"
                    : "border-gray-400 text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setFormData({ ...formData, role: "CHILD" })}
              >
                Family Member
              </button>
              <button
                type="button"
                className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center transition-colors font-bold ${
                  formData.role === "ELDER"
                    ? "border-blue-600 bg-blue-100 text-blue-900"
                    : "border-gray-400 text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setFormData({ ...formData, role: "ELDER" })}
              >
                Elder
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors disabled:opacity-50 text-lg"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-800 text-base font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
