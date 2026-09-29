import os

content = '''"use client"

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
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [viewerType, setViewerType] = useState<string | null>(null)

  const handleView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Determine the true MIME type
    let mime = doc.fileType;
    let finalUrl = doc.fileUrl;

    if (!doc.fileUrl.startsWith('http')) {
      try {
        const arr = doc.fileUrl.split(',');
        mime = arr[0].match(/:(.*?);/)?.[1] || doc.fileType;
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], {type: mime});
        finalUrl = URL.createObjectURL(blob);
      } catch(err) {
        console.error(err);
        alert("Unable to open document.");
        return;
      }
    }
    
    setViewerType(mime);
    setViewerUrl(finalUrl);
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(Are you sure you want to delete ""?)) return
    
    setLoading(true)
    try {
      const res = await fetch(/api/documents?id=, { method: "DELETE" })
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

  const closeViewer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewerUrl(null);
  }

  return (
    <>
      <tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => handleView()}>
        <td className="p-4 px-6 font-bold text-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
            {doc.fileType.includes("pdf") ? "dY"," : "dY-,?"}
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

      {/* Full Screen In-App Viewer Modal */}
      {viewerUrl && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col" onClick={closeViewer}>
          
          {/* Toolbar */}
          <div className="flex justify-between items-center p-4 bg-black/50 text-white">
            <div className="font-bold">{doc.title}</div>
            <button onClick={closeViewer} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
            {viewerType?.includes("pdf") ? (
              <iframe src={viewerUrl} className="w-full h-full bg-white rounded-xl" title="PDF Viewer" />
            ) : (
              <img src={viewerUrl} alt={doc.title} className="max-w-full max-h-full object-contain rounded-lg" />
            )}
          </div>
        </div>
      )}
    </>
  )
}'''

with open('src/app/child/documents/DocumentRow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
