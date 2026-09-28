"use client"
import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Unregister all existing service workers to forcefully bust the WebView cache
      // and permanently delete the ghost of AlarmSystem.tsx
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister()
        }
      }).catch(function(err) {
        console.log("Service Worker unregistration failed: ", err)
      })
    }
  }, [])
  return null
}
