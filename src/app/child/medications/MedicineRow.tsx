"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { EditMedicineModal } from "./EditMedicineModal"

type Medication = {
  id: string
  name: string
  dosage: string
  time: string
  frequency: string
  instructions: string | null
}

export function MedicineRow({ med }: { med: Medication }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

    const formatFreq = (f: string) => {
    if (!f || f.toLowerCase() === "daily" || f === "0,1,2,3,4,5,6") return "Every Day";
    const map: any = { "0": "Sun", "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat" };
    return f.split(",").map(d => map[d.trim()]).filter(Boolean).join(", ");
  }

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
    <tr className="hover:bg-slate-50 transition group">
      <td className="p-4 px-6 font-bold text-slate-900">{med.name}</td>
      <td className="p-4 px-6 text-slate-600 font-medium">{med.dosage}</td>
      <td className="p-4 px-6 text-blue-600 font-bold">{med.time}</td>
      <td className="p-4 px-6 text-slate-600 font-medium">{formatFreq(med.frequency)}</td>
      <td className="p-4 px-6 text-right space-x-2">
        <div className="inline-block">
          <EditMedicineModal med={med} />
        </div>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition disabled:opacity-50"
        >
          {loading ? "..." : "Delete"}
        </button>
      </td>
    </tr>
  )
}
