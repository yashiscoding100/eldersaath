"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function UploadDocumentForm({ elderId }: { elderId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    
    try {
      // Convert file to base64 for MVP storage
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64data = reader.result
        
        await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            elderId, 
            title, 
            fileType: file.type,
            fileData: base64data 
          })
        })

        setIsOpen(false)
        setTitle("")
        setFile(null)
        router.refresh()
      }
      reader.readAsDataURL(file)
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
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
      >
        + Upload Document
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload Medical Document</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Document Title</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Cardiologist Report Aug 2026" 
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 outline-none font-medium text-gray-900" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">File (PDF or Image)</label>
            <input 
              required
              type="file" 
              accept=".pdf,image/*"
              className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-gray-700 cursor-pointer" 
              onChange={e => setFile(e.target.files?.[0] || null)} 
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={loading || !file} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? "Uploading..." : "Save Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
