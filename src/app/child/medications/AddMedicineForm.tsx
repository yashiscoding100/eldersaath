"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddMedicineForm({ elderId }: { elderId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Daily",
    time: "08:00 AM",
    instructions: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, ...formData })
      })
      setIsOpen(false)
      setFormData({ name: "", dosage: "", frequency: "Daily", time: "08:00 AM", instructions: "" })
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        + Add Medicine
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add New Medicine</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Medicine Name</label>
            <input required type="text" className="text-gray-900 font-bold w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <input required type="text" placeholder="e.g. 5mg" className="text-gray-900 font-bold w-full border p-2 rounded" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input required type="time" className="text-gray-900 font-bold w-full border p-2 rounded" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instructions (Optional)</label>
            <input type="text" placeholder="e.g. After meals" className="text-gray-900 font-bold w-full border p-2 rounded" value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
