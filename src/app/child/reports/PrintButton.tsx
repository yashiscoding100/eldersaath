"use client"
export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md flex items-center gap-2 print:hidden"
    >
      <span className="text-xl">🖨️</span> Download PDF
    </button>
  )
}
