"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SOSPage() {
  const router = useRouter()
  const [status, setStatus] = useState("Press button to send alert")
  const [sending, setSending] = useState(false)

  const handleSOS = async () => {
    setSending(true)
    setStatus("Getting your location...")
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setStatus("Alerting family...")
          try {
            await fetch("/api/sos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              })
            })
            setStatus("Family and Emergency Contacts have been alerted!")
          } catch (e) {
            setStatus("Failed to send automatic alert. Please call 112.")
          }
          setSending(false)
        },
        (error) => {
          setStatus("Could not get location. Alerting family anyway...")
          // Still alert without location
          fetch("/api/sos", { method: "POST", body: JSON.stringify({}) }).finally(() => setSending(false))
        }
      )
    } else {
      setStatus("Sending alert without location...")
      fetch("/api/sos", { method: "POST", body: JSON.stringify({}) }).finally(() => setSending(false))
    }
  }

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        
        <h1 className="text-4xl font-black text-red-700">EMERGENCY</h1>
        
        <button 
          onClick={handleSOS}
          disabled={sending}
          className="w-64 h-64 mx-auto rounded-full bg-red-600 shadow-2xl flex items-center justify-center border-8 border-red-200 active:scale-95 transition-transform disabled:opacity-80"
        >
          <span className="text-white text-5xl font-black tracking-widest">SOS</span>
        </button>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
           <p className="text-xl font-bold text-gray-800">{status}</p>
        </div>

        <div className="grid gap-4 mt-8">
           <a href="tel:112" className="w-full py-5 bg-white text-red-600 font-bold rounded-2xl text-2xl border-2 border-red-600 shadow-sm block">
             Call Ambulance (112)
           </a>
           <button onClick={() => router.push("/elder/home")} className="w-full py-4 bg-gray-200 text-gray-800 font-bold rounded-2xl text-xl mt-4">
             Cancel & Go Back
           </button>
        </div>

      </div>
    </div>
  )
}
