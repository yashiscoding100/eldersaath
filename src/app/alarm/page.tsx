
"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LocalNotifications } from "@capacitor/local-notifications"
import { Capacitor } from "@capacitor/core"

import { Suspense } from "react"

function AlarmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const label = searchParams.get("label") || "EMERGENCY ALARM!"
  const body = searchParams.get("body") || "Please check the notification for more details."
  const snoozeDuration = parseInt(searchParams.get("snooze") || "10", 10)
  const snoozeText = searchParams.get("snoozeText") || "I'll take the medicines later"

  useEffect(() => {
    // Play a gentle repetitive chime instead of aggressive harsh beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      const playChime = () => {
        if (audioCtx.state === "closed") return
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime)
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2)
        
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0)
        
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        
        oscillator.start()
        oscillator.stop(audioCtx.currentTime + 1.0)
      }
      
      const beepInterval = setInterval(playChime, 1500)
      
      return () => {
        clearInterval(beepInterval)
        if (audioCtx.state !== "closed") {
          audioCtx.close()
        }
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e)
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
                type: "ALARM",
                label: label,
                body: body,
                snoozeDuration: snoozeDuration
              }
            }
          ]
        })
        alert(`Snoozed! Waking you up again in ${snoozeDuration} mins.`)
      } catch (err) {
        console.error("Local notification error", err)
        alert(`Snoozed for ${snoozeDuration} minutes.`)
      }
    } else {
      alert(`Snoozed for ${snoozeDuration} minutes.`)
    }
    
    router.replace("/dashboard")
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1E1B4B] to-[#312E81]">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md text-center">
        
        <h1 className="text-[32px] font-bold text-white mb-8">
          {decodeURIComponent(label)}
        </h1>

        <p className="text-[18px] text-[#E0E7FF] mb-16 px-4">
          {decodeURIComponent(body)}
        </p>
        
        <div className="w-full space-y-8 mt-4">
          <button 
            onClick={handleStop}
            className="w-full py-4 bg-[#10B981] text-white text-[18px] font-bold rounded-[30px] hover:scale-95 transition-transform shadow-lg"
          >
            TAKE MEDICINE / STOP ALARM
          </button>
          
          <button 
            onClick={handleSnooze}
            className="w-full py-4 bg-[#4B5563] border-[3px] border-[#6B7280] text-[#F3F4F6] text-[16px] font-medium rounded-[30px] hover:scale-95 transition-transform"
          >
            {decodeURIComponent(snoozeText)} ({snoozeDuration}M)
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AlarmPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#1E1B4B] flex items-center justify-center text-white text-3xl font-bold">LOADING...</div>}>
      <AlarmContent />
    </Suspense>
  )
}
