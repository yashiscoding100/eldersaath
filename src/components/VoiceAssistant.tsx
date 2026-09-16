"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function VoiceAssistant() {
  const router = useRouter()
  const [isSupported, setIsSupported] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState("")
  const [confirmingSos, setConfirmingSos] = useState(false)
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setFeedback("Listening...")
    }

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase()
      setTranscript(text)
      handleIntent(text)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error)
      setIsListening(false)
      setFeedback("Sorry, didn't catch that.")
      setTimeout(() => setFeedback(""), 3000)
    }

    recognition.onend = () => {
      setIsListening(false)
      // Clear feedback after a delay if not confirming SOS
      setTimeout(() => {
        setFeedback(prev => prev === "Listening..." ? "" : prev)
      }, 3000)
    }

    recognitionRef.current = recognition
  }, [])

  const handleIntent = (text: string) => {
    if (confirmingSos) {
      if (text.includes("yes") || text.includes("confirm")) {
        setFeedback("Triggering SOS...")
        router.push('/elder/sos')
        setConfirmingSos(false)
      } else {
        setFeedback("SOS Cancelled.")
        setConfirmingSos(false)
      }
      return
    }

    if (text.includes("medicine") || text.includes("pill")) {
      setFeedback("Opening Medicines...")
      router.push('/elder/medications')
    } else if (text.includes("health") || text.includes("blood pressure") || text.includes("check")) {
      setFeedback("Opening Health Check...")
      router.push('/elder/checkin')
    } else if (text.includes("task") || text.includes("chore")) {
      setFeedback("Opening Tasks...")
      router.push('/elder/tasks')
    } else if (text.includes("home") || text.includes("dashboard")) {
      setFeedback("Going Home...")
      router.push('/elder/home')
    } else if (text.includes("sos") || text.includes("emergency") || text.includes("help")) {
      setFeedback("Did you say SOS? Say YES to confirm.")
      setConfirmingSos(true)
      // Automatically start listening again for confirmation
      setTimeout(() => {
        if (recognitionRef.current) {
          try { recognitionRef.current.start() } catch (e) {}
        }
      }, 500)
    } else {
      setFeedback("Command not recognized. Try 'Show my medicines'.")
    }
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      setTranscript("")
      setFeedback("")
      try {
        recognitionRef.current?.start()
      } catch (e) {}
    }
  }

  if (!isSupported) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {feedback && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl max-w-[250px] animate-fade-in-up">
          <p className="font-bold text-lg">{feedback}</p>
          {transcript && !isListening && (
            <p className="text-sm text-slate-400 mt-1">"{transcript}"</p>
          )}
        </div>
      )}
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
          isListening 
            ? 'bg-red-500 animate-pulse text-white' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
        }`}
        aria-label="Voice Assistant"
      >
        <span className="text-3xl">🎙️</span>
      </button>
    </div>
  )
}
