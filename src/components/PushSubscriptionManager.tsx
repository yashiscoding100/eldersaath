"use client"
import { useState, useEffect } from "react"
import { Capacitor } from "@capacitor/core"
import { PushNotifications } from "@capacitor/push-notifications"

export function PushSubscriptionManager() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.checkPermissions().then((res) => {
        if (res.receive === 'granted') setIsSubscribed(true)
      })
      
      // Force notifications to show even when app is open!
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        alert("ALARM RECEIVED: " + notification.title + "\n" + notification.body);
      });
    } else {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setSupported(false)
        return
      }
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setIsSubscribed(true)
        })
      })
    }
  }, [])

  const subscribe = async () => {
    setLoading(true)
    try {
      if (Capacitor.isNativePlatform()) {
        let permStatus = await PushNotifications.checkPermissions()
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions()
        }
        if (permStatus.receive !== 'granted') {
          throw new Error('User denied permissions!')
        }
        
        // Create the Android Notification Channel explicitly!
        await PushNotifications.createChannel({
          id: 'sos_alarms',
          name: 'Emergency Alarms',
          description: 'High priority SOS alarms',
          importance: 5,
          visibility: 1,
          vibration: true
        });

        // Setup listener before registering
        PushNotifications.addListener('registration', async (token) => {
           await fetch("/api/push", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               endpoint: "fcm:" + token.value,
               keys: { p256dh: "fcm", auth: "fcm" }
             })
           })
           setIsSubscribed(true)
           alert("Native App Notifications enabled successfully!")
        })
        
        await PushNotifications.register()
      } else {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        })
        
        await fetch("/api/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub)
        })
        setIsSubscribed(true)
        alert("Web Notifications enabled successfully!")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to enable notifications. Please ensure you have granted permission.")
    } finally {
      setLoading(false)
    }
  }

  if (!supported) return <div className="text-xs text-slate-400">Push not supported on this device.</div>

  if (isSubscribed) return <div className="text-sm font-bold text-green-600 flex items-center gap-1">✅ Notifications Enabled</div>

  return (
    <button 
      onClick={subscribe}
      disabled={loading}
      className="text-sm bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition"
    >
      {loading ? "Enabling..." : "Enable Push Notifications"}
    </button>
  )
}
