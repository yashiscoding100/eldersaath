"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type MedicalDocument = {
  id: string
  title: string
  fileType: string
  fileUrl: string
  uploadedAt: Date
}

export function DocumentRow({ doc }: { doc: MedicalDocument }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

    const handleView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (doc.fileUrl.startsWith('http')) {
      window.open(doc.fileUrl, '_blank');
      return;
    }

    try {
      const arr = doc.fileUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || doc.fileType;
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], {type: mime});
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch(err) {
      console.error(err);
      alert("Unable to open document.");
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/documents?id=${doc.id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete document")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => handleView()}>
      <td className="p-4 px-6 font-bold text-slate-900 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
          {doc.fileType.includes("pdf") ? "📄" : "🖼️"}
        </div>
        {doc.title}
      </td>
      <td className="p-4 px-6 text-slate-500 font-medium uppercase text-xs tracking-wider">
        {doc.fileType.split('/')[1] || doc.fileType}
      </td>
      <td className="p-4 px-6 text-slate-600 font-medium">
        {new Date(doc.uploadedAt).toLocaleDateString()}
      </td>
      <td className="p-4 px-6 text-right space-x-2">
        <button onClick={handleView} className="text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition inline-block">View</button>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition disabled:opacity-50"
        >
          {loading ? "..." : "Delete"}
        </button>
      </td>
    </tr>
  )
}
