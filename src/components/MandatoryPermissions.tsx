"use client"

import { useEffect, useState } from "react"
import { Capacitor, registerPlugin } from "@capacitor/core"
import { PushNotifications } from "@capacitor/push-notifications"
import { AlertTriangle, Layers, Bell } from "lucide-react"

// Bind the custom local plugin we wrote in Java
const AppPermissions = registerPlugin("AppPermissions") as any

export function MandatoryPermissions() {
  const [overlayGranted, setOverlayGranted] = useState(true)
  const [pushGranted, setPushGranted] = useState(true)
  const [checking, setChecking] = useState(true)

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      setChecking(false)
      return
    }

    try {
      // 1. Check Overlay
      const overlayRes = await AppPermissions.checkOverlayPermission()
      setOverlayGranted(overlayRes.granted)

      // 2. Check Push
      const pushRes = await PushNotifications.checkPermissions()
      setPushGranted(pushRes.receive === "granted")

      // Sync FCM token if granted
      if (pushRes.receive === "granted") {
        await PushNotifications.register()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
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
        } catch(e) {}
      })
      
      checkPermissions()

      // When user returns from Android Settings, re-check everything
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          checkPermissions()
        }
      })
    }
  }, [])

  const handleRequestOverlay = async () => {
    await AppPermissions.requestOverlayPermission()
  }

  const handleRequestPush = async () => {
    try {
      let permStatus = await PushNotifications.checkPermissions()
      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions()
      }
      if (permStatus.receive !== "granted") {
        alert("To enable notifications:\\n\\n1. Open your phone's 'Settings' app\\n2. Tap 'Apps'\\n3. Find 'Elder Saath'\\n4. Tap 'Notifications' and turn them ON")
      } else {
        await checkPermissions()
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (checking || (!Capacitor.isNativePlatform())) return null
  if (overlayGranted && pushGranted) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-white mb-2">Setup Required</h1>
        <p className="text-sm text-slate-400 mb-8">
          To ensure life-saving SOS alerts and medical alarms can wake up your phone, we need two permissions.
        </p>

        <div className="space-y-4">
          {/* Step 1: Overlay */}
          <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${overlayGranted ? "bg-emerald-900/30 border-emerald-500/30 opacity-50" : "bg-slate-700 border-slate-600"}`}>
            <div className={`p-3 rounded-full ${overlayGranted ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white">1. Screen Overlay</h3>
              <p className="text-xs text-slate-400">Allow alarms to show full screen</p>
            </div>
            {!overlayGranted && (
              <button onClick={handleRequestOverlay} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition">
                Fix
              </button>
            )}
            {overlayGranted && <span className="text-emerald-400 font-bold text-sm pr-2">Done</span>}
          </div>

          {/* Step 2: Push Notifications */}
          <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${pushGranted ? "bg-emerald-900/30 border-emerald-500/30 opacity-50" : "bg-slate-700 border-slate-600"}`}>
            <div className={`p-3 rounded-full ${pushGranted ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white">2. Notifications</h3>
              <p className="text-xs text-slate-400">Receive SOS and Med Alerts</p>
            </div>
            {!pushGranted && overlayGranted && (
              <button onClick={handleRequestPush} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition">
                Fix
              </button>
            )}
            {!pushGranted && !overlayGranted && (
              <span className="text-slate-500 text-xs font-bold pr-2">Wait</span>
            )}
            {pushGranted && <span className="text-emerald-400 font-bold text-sm pr-2">Done</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
