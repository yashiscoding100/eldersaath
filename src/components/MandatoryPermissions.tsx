"use client"

import { useEffect, useState } from "react"
import { Capacitor } from "@capacitor/core"
import { PushNotifications } from "@capacitor/push-notifications"
import { AlertTriangle } from "lucide-react"

export function MandatoryPermissions() {
  const [isBlocked, setIsBlocked] = useState(false)

  const checkAndRequestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      let permStatus = await PushNotifications.checkPermissions()

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions()
      }

      if (permStatus.receive !== 'granted') {
        setIsBlocked(true)
      } else {
        setIsBlocked(false)
      }
    } catch (e) {
      console.error("Failed to check permissions", e)
      // If it fails on web/emulator without push support, we shouldn't hard block them
      // But we will block if we are absolutely sure it's native
    }
  }

  useEffect(() => {
    checkAndRequestPermissions()

    // Add listener for app coming to foreground to re-check if they went to settings
    if (Capacitor.isNativePlatform()) {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible') {
          checkAndRequestPermissions()
        }
      })
    }
  }, [])

  if (!isBlocked) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Action Required</h1>
      <p className="text-lg text-slate-300 mb-8 max-w-md">
        This app uses critical life-saving SOS alerts and medical alarms to function. 
        <br /><br />
        You <strong>must</strong> allow notifications in your Android device settings to use this app.
      </p>
      
      <button 
        onClick={checkAndRequestPermissions}
        className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
      >
        I have enabled them
      </button>

      <p className="text-sm text-slate-500 mt-6">
        (Go to Settings &rarr; Apps &rarr; Elder Saath &rarr; Notifications)
      </p>
    </div>
  )
}
