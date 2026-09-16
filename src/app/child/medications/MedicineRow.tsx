"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Medication = {
  id: string
  name: string
  dosage: string
  time: string
  frequency: string
}

export function MedicineRow({ med }: { med: Medication }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete ${med.name}?`)) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/medications?id=${med.id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
      <td className="p-4 font-bold text-gray-900">{med.name}</td>
      <td className="p-4 text-gray-600 font-medium">{med.dosage}</td>
      <td className="p-4 text-blue-600 font-bold">{med.time}</td>
      <td className="p-4 text-gray-600 font-medium">{med.frequency}</td>
      <td className="p-4 text-right">
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "..." : "Delete"}
        </button>
      </td>
    </tr>
  )
}
