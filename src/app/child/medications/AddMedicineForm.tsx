"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

export function AddMedicineForm({ elderId }: { elderId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    
    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      
      try {
        const res = await fetch("/api/ocr/prescription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64String })
        })
        
        if (res.ok) {
          const data = await res.json()
          if (data.extractedData) {
            setFormData(prev => ({
              ...prev,
              name: data.extractedData.name || prev.name,
              dosage: data.extractedData.dosage || prev.dosage,
              frequency: data.extractedData.frequency || prev.frequency,
            }))
            alert("Prescription scanned! Please verify the extracted information before saving.")
          }
        }
      } catch (error) {
        console.error("Scan error", error)
        alert("Failed to scan prescription.")
      } finally {
        setScanning(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    reader.readAsDataURL(file)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
      >
        + Add Medicine
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
        <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Add New Medicine</h2>
        
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-sm font-bold text-slate-700 mb-2">Have a prescription?</p>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleScan}
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
            className="w-full bg-slate-900 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition hover:bg-slate-800 disabled:opacity-50"
          >
            {scanning ? "Scanning... Please wait" : "📸 Auto-Fill via AI Scan"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Medicine Name</label>
            <input required type="text" className="text-gray-900 font-bold w-full border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Dosage</label>
              <input required type="text" placeholder="e.g. 500mg" className="text-gray-900 font-bold w-full border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
              <input required type="time" className="text-gray-900 font-bold w-full border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Instructions (Optional)</label>
            <input type="text" placeholder="e.g. After meals" className="text-gray-900 font-bold w-full border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} />
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 font-bold text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-md">Confirm & Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
