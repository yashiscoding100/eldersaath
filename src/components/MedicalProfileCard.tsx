"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Edit2, Check } from "lucide-react"

export function MedicalProfileCard({ initialProfile, elderId }: { initialProfile: any, elderId?: string }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    bloodGroup: initialProfile?.bloodGroup || "",
    allergies: initialProfile?.allergies || "",
    medicalConditions: initialProfile?.medicalConditions || "",
    preferredHospital: initialProfile?.preferredHospital || "",
    notes: initialProfile?.notes || ""
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await fetch("/api/elder/medical-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, elderId })
      })
      setIsEditing(false)
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200 mt-6 relative">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Edit Medical Records</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Blood Group</label>
            <input type="text" className="w-full border rounded-lg p-2" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} placeholder="e.g. O+" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Allergies</label>
            <input type="text" className="w-full border rounded-lg p-2" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} placeholder="e.g. Peanuts, Penicillin" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Medical Conditions</label>
            <textarea className="w-full border rounded-lg p-2" value={form.medicalConditions} onChange={e => setForm({...form, medicalConditions: e.target.value})} placeholder="e.g. Hypertension, Diabetes" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Hospital</label>
            <input type="text" className="w-full border rounded-lg p-2" value={form.preferredHospital} onChange={e => setForm({...form, preferredHospital: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg font-bold">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6 relative group">
      <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition">
        <Edit2 className="w-4 h-4" />
      </button>
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-red-500" />
        Medical Records & Profile
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase">Blood Group</p>
          <p className="font-semibold text-slate-800">{form.bloodGroup || "Not specified"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase">Allergies</p>
          <p className="font-semibold text-slate-800">{form.allergies || "None reported"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 md:col-span-2">
          <p className="text-xs font-bold text-slate-400 uppercase">Known Medical Conditions</p>
          <p className="font-semibold text-slate-800">{form.medicalConditions || "None reported"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 md:col-span-2">
          <p className="text-xs font-bold text-slate-400 uppercase">Preferred Hospital</p>
          <p className="font-semibold text-slate-800">{form.preferredHospital || "Not specified"}</p>
        </div>
      </div>
    </div>
  )
}