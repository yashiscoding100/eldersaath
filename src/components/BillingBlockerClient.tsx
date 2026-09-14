"use client"

import { useState } from "react"
import { LogoutButton } from "@/components/LogoutButton"

export function BillingBlockerClient({ message }: { message: string }) {
  const [show, setShow] = useState(false)

  return (
    <div 
      className="fixed inset-0 z-[99999]" 
      onClickCapture={(e) => {
        // Prevent all clicks from propagating down to the actual app buttons
        e.stopPropagation()
        e.preventDefault()
        setShow(true)
      }}
    >
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-md pointer-events-auto z-[100000]">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl mx-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
            <div className="text-7xl mb-6">🔒</div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Account Suspended</h2>
            <p className="text-slate-600 font-medium text-lg mb-8 leading-relaxed">
              {message || "Your account has been temporarily disabled. Please contact support."}
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setShow(false)
                }} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition"
              >
                I Understand
              </button>
              
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="w-full block bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-8 rounded-2xl transition"
              >
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
