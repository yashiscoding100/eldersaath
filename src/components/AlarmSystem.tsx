"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"

export function AlarmSystem() {
  const { data: session } = useSession()
  const [isRinging, setIsRinging] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)

  // A function to generate a persistent ringing alarm using the Web Audio API
  const startRinging = () => {
    if (isRinging) return
    setIsRinging(true)
    
    // Create AudioContext if not exists
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    // Stop any existing oscillator just in case
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); oscillatorRef.current.disconnect(); } catch(e) {}
    }

    // Create an oscillator for a high-pitched alarm sound
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = "square"
    osc.frequency.setValueAtTime(800, ctx.currentTime) // High pitch
    
    // Create a pulsing effect (LFO on gain)
    const lfo = ctx.createOscillator()
    lfo.type = "square"
    lfo.frequency.value = 2 // 2 pulses per second
    
    lfo.connect(gain.gain)
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    lfo.start()
    
    oscillatorRef.current = osc
  }

  const stopRinging = () => {
    setIsRinging(false)
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
      } catch (e) {}
      oscillatorRef.current = null
    }
  }

  useEffect(() => {
    if (session?.user?.role !== "ELDER") return

    let isChecking = false;

    const checkAlarms = async () => {
      if (isChecking || isRinging) return;
      isChecking = true;

      try {
        const res = await fetch("/api/medications")
        if (!res.ok) return
        
        const meds = await res.json()
        
        const now = new Date()
        const currentHours = now.getHours().toString().padStart(2, '0')
        const currentMinutes = now.getMinutes().toString().padStart(2, '0')
        const currentTimeString = `${currentHours}:${currentMinutes}` // "HH:MM"
        
        // Let's also support the old format "08:00 AM" if someone manually entered it
        const currentAMPM = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

        for (const med of meds) {
          // If medication time matches current time
          if (med.time === currentTimeString || med.time.toUpperCase() === currentAMPM.toUpperCase()) {
            // Check if it's already taken today
            const hasLog = med.logs && med.logs.length > 0;
            if (!hasLog) {
              startRinging()
              break // Only ring once
            }
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        isChecking = false;
      }
    }

    // Check every 30 seconds
    const interval = setInterval(checkAlarms, 30000)
    checkAlarms() // Initial check

    // Custom manual trigger (Test Button)
    const handleTrigger = () => startRinging()
    window.addEventListener("trigger-alarm", handleTrigger)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("trigger-alarm", handleTrigger)
    }
  }, [session, isRinging])

  if (!isRinging) return null

  return (
    <div className="fixed inset-0 bg-red-600 bg-opacity-95 z-[9999] flex flex-col items-center justify-center p-6 animate-pulse">
      <div className="text-8xl mb-8">⏰</div>
      <h1 className="text-5xl font-black text-white text-center mb-12">
        MEDICATION<br/>REMINDER!
      </h1>
      <button 
        onClick={stopRinging}
        className="bg-white text-red-600 text-3xl font-black px-12 py-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        STOP ALARM
      </button>
    </div>
  )
}
