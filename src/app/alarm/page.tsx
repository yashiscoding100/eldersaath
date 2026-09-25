"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LocalNotifications } from "@capacitor/local-notifications"
import { Capacitor } from "@capacitor/core"

export default function AlarmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const label = searchParams.get("label") || "ALARM!"
  const snoozeDuration = parseInt(searchParams.get("snooze") || "10", 10)
  
  const [flashing, setFlashing] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Start flashing loop
    const interval = setInterval(() => {
      setFlashing(f => !f)
    }, 500)

    // Play a loud synthesized alarm sound via Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      const playBeep = () => {
        if (audioCtx.state === 'closed') return
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
        oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.2) // High pitch
        
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
        
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        
        oscillator.start()
        oscillator.stop(audioCtx.currentTime + 0.5)
      }
      
      const beepInterval = setInterval(playBeep, 600)
      
      return () => {
        clearInterval(interval)
        clearInterval(beepInterval)
        if (audioCtx.state !== 'closed') {
          audioCtx.close()
        }
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e)
      return () => clearInterval(interval)
    }
  }, [])

  const handleStop = () => {
    router.replace("/dashboard")
  }

  const handleSnooze = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.requestPermissions()
        
        await LocalNotifications.schedule({
          notifications: [
            {
              title: label,
              body: "Snooze timer finished! " + label,
              id: new Date().getTime(),
              schedule: { at: new Date(Date.now() + snoozeDuration * 60 * 1000) },
              sound: "default",
              actionTypeId: "",
              extra: {
                type: 'ALARM',
                label: label,
                snoozeDuration: snoozeDuration
              }
            }
          ]
        })
        alert(`Alarm snoozed for ${snoozeDuration} minutes.`)
      } catch (err) {
        console.error("Local notification error", err)
        alert("Snoozed! (Make sure you keep the app open to ring again)")
        // Fallback to JS timeout if native fails
        setTimeout(() => {
          window.location.reload()
        }, snoozeDuration * 60 * 1000)
      }
    } else {
      alert(`Snoozed for ${snoozeDuration} minutes.`)
      setTimeout(() => {
        window.location.reload()
      }, snoozeDuration * 60 * 1000)
    }
    
    router.replace("/dashboard")
  }

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 transition-colors duration-200 ${flashing ? 'bg-red-600' : 'bg-white'}`}>
      
      <div className="absolute top-12 animate-bounce">
        <span className="text-7xl">🚨</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md text-center space-y-8 z-10">
        
        <h1 className={`text-5xl md:text-6xl font-black uppercase tracking-widest ${flashing ? 'text-white' : 'text-red-600'}`}>
          {label}
        </h1>
        
        <div className="w-full space-y-4 pt-12">
          <button 
            onClick={handleStop}
            className="w-full py-6 bg-slate-900 text-white text-3xl font-black uppercase rounded-2xl hover:scale-95 transition-transform shadow-2xl active:bg-slate-800"
          >
            STOP
          </button>
          
          <button 
            onClick={handleSnooze}
            className={`w-full py-6 text-2xl font-black uppercase rounded-2xl border-4 transition-transform hover:scale-95 shadow-xl ${flashing ? 'bg-white text-red-600 border-white' : 'bg-slate-100 text-slate-800 border-slate-300'}`}
          >
            SNOOZE ({snoozeDuration}M)
          </button>
        </div>

      </div>
    </div>
  )
}
