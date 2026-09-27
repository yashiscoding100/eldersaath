
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

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions()
      }

      if (permStatus.receive !== "granted") {
        setIsBlocked(true)
      } else {
        setIsBlocked(false)
        // CRITICAL BUG FIX: If granted, we MUST register with FCM and Vercel globally!
        await PushNotifications.register()
      }
    } catch (e) {
      console.error("Failed to check permissions", e)
    }
  }

  useEffect(() => {
    
    if (Capacitor.isNativePlatform()) {
      // Global Token Sync Listener
      PushNotifications.addListener("registration", async (token) => {
         try {
           await fetch("/api/push", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               endpoint: "fcm:" + token.value,
               keys: { p256dh: "fcm", auth: "fcm" }
             })
           })
         } catch(e) { console.error("Failed to sync FCM token", e) }
      })
      
      checkAndRequestPermissions()

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          checkAndRequestPermissions()
        }
      })
    }
  }, [])

  const handleButtonClick = async () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      let permStatus = await PushNotifications.checkPermissions()

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions()
      }

      if (permStatus.receive !== "granted") {
        alert("To enable notifications:\n\n1. Open your phone's 'Settings' app\n2. Tap 'Apps'\n3. Find 'Elder Saath'\n4. Tap 'Notifications' and turn them ON\n\nOnce enabled, this screen will disappear automatically!")
      } else {
        setIsBlocked(false)
        await PushNotifications.register()
      }
    } catch (e) {
      console.error(e)
    }
  }

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
        onClick={handleButtonClick}
        className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
      >
        How to Enable
      </button>

      <p className="text-sm text-slate-500 mt-6">
        (Go to Settings &rarr; Apps &rarr; Elder Saath &rarr; Notifications)
      </p>
    </div>
  )
}
