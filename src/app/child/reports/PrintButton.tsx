"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

export function PrintButton() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setDownloading(true)
      const element = document.getElementById("report-content")
      if (!element) throw new Error("Report element not found")

      // Generate canvas
      const canvas = await html2canvas(element, { 
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
      })
      
      const imgData = canvas.toDataURL("image/png")
      
      // Calculate PDF dimensions (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      
      // Check if we are running in an Android/iOS WebView via Capacitor
      if (typeof window !== "undefined" && (window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        try {
          const { Capacitor } = await import('@capacitor/core')
          const { Filesystem, Directory } = await import('@capacitor/filesystem')
          const { Share } = await import('@capacitor/share')

          const pdfBase64 = pdf.output('datauristring').split(',')[1]
          const fileName = `Health_Report_${Date.now()}.pdf`
          
          // Write to native file system
          const result = await Filesystem.writeFile({
            path: fileName,
            data: pdfBase64,
            directory: Directory.Cache
          })
          
          // Share or save natively
          await Share.share({
            title: 'Health Report',
            url: result.uri,
            dialogTitle: 'Save or Share PDF'
          })
        } catch (nativeErr) {
          console.error("Native share failed:", nativeErr)
          // Fallback to try standard save
          pdf.save("ElderSaath_Health_Report.pdf")
        }
      } else {
        // Standard Web Browser Download
        pdf.save("ElderSaath_Health_Report.pdf")
      }
    } catch (e) {
      console.error("Failed to generate PDF", e)
      alert("Failed to generate PDF: " + (e instanceof Error ? e.message : String(e)))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button 
      disabled={downloading}
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md flex items-center gap-2 print:hidden disabled:opacity-50"
    >
      {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      Download PDF
    </button>
  )
}
