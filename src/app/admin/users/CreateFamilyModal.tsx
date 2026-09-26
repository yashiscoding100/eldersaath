"use client"

import { useState } from "react"
import { createFamilyNetwork } from "../actions"
import { Users } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string | null
  role: string
}

export function CreateFamilyModal({ allUsers }: { allUsers: User[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // State for selections
  const [selectedElders, setSelectedElders] = useState<string[]>([])
  const [selectedChildren, setSelectedChildren] = useState<string[]>([])

  const elders = allUsers.filter(u => u.role === "ELDER")
  const children = allUsers.filter(u => u.role === "CHILD")

  const toggleElder = (id: string) => {
    setSelectedElders(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  const toggleChild = (id: string) => {
    setSelectedChildren(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const handleCreate = async () => {
    if (selectedElders.length === 0 || selectedChildren.length === 0) {
      alert("Please select at least one Elder and one Child.")
      return
    }

    setLoading(true)
    try {
      const res = await createFamilyNetwork(selectedElders, selectedChildren)
      alert(res.message)
      setIsOpen(false)
      setSelectedElders([])
      setSelectedChildren([])
    } catch (err: any) {
      alert(err.message || "Failed to create family network")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
      >
        <Users className="w-5 h-5" />
        Form Family Group
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Form a Family Group</h3>
                <p className="text-sm font-medium text-slate-500">
                  Select multiple parents and children to instantly link them all together.
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors">
                X
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white flex flex-col md:flex-row gap-6">
              
              {/* ELDERS LIST */}
              <div className="flex-1 space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-2">1. Select Parents (Elders)</h4>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                  {elders.map(elder => (
                    <label key={elder.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedElders.includes(elder.id) ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-50 border-slate-200'}`}>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        checked={selectedElders.includes(elder.id)}
                        onChange={() => toggleElder(elder.id)}
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{elder.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{elder.email}</p>
                      </div>
                    </label>
                  ))}
                  {elders.length === 0 && <p className="text-sm text-slate-500 italic">No elders found.</p>}
                </div>
              </div>

              {/* CHILDREN LIST */}
              <div className="flex-1 space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-2">2. Select Children (Caregivers)</h4>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                  {children.map(child => (
                    <label key={child.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedChildren.includes(child.id) ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-slate-50 border-slate-200'}`}>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                        checked={selectedChildren.includes(child.id)}
                        onChange={() => toggleChild(child.id)}
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{child.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{child.email}</p>
                      </div>
                    </label>
                  ))}
                  {children.length === 0 && <p className="text-sm text-slate-500 italic">No children found.</p>}
                </div>
              </div>

            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 flex items-center justify-between shrink-0">
              <p className="text-sm font-medium text-slate-600">
                Selected: {selectedElders.length} Parents, {selectedChildren.length} Children
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || selectedElders.length === 0 || selectedChildren.length === 0}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shadow-md flex items-center gap-2"
                >
                  {loading ? "Linking..." : "Form Family"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
