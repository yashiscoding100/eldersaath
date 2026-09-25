import webpush from "web-push"
import { prisma } from "./prisma"
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import fs from 'fs'
import path from 'path'

// 1. Setup Web Push (VAPID)
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const privateKey = process.env.VAPID_PRIVATE_KEY || ""

if (publicKey && privateKey) {
  webpush.setVapidDetails(
    "mailto:support@eldersaath.com",
    publicKey,
    privateKey
  )
}

// 2. Setup Firebase Admin (FCM)
let firebaseInitialized = false
let firebaseInitError = ""
try {
  if (!getApps().length) {
    let serviceAccount = null
    
    // First try env vars (for Vercel)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      let rawKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // 1. Strip literal quotes
      rawKey = rawKey.replace(/"/g, '');
      // 2. Strip literal escaped slashes (\n, \r)
      rawKey = rawKey.replace(/\\n/g, '').replace(/\\r/g, '');
      // 3. Strip all actual whitespace and newlines
      rawKey = rawKey.replace(/\s+/g, '');
      
      // 4. Extract the base64 payload and reconstruct a perfectly valid PEM
      const base64Match = rawKey.match(/-----BEGINPRIVATEKEY-----(.+)-----ENDPRIVATEKEY-----/);
      if (base64Match && base64Match[1]) {
        rawKey = '-----BEGIN PRIVATE KEY-----\n' + base64Match[1] + '\n-----END PRIVATE KEY-----\n';
      }
      
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: rawKey,
      }
    } 
    // Fallback to local file
    else {
      const keyPath = path.join(process.cwd(), 'firebase-admin-key.json')
      if (fs.existsSync(keyPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
      } else {
        firebaseInitError = "Missing FIREBASE env vars on Vercel"
      }
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount)
      })
      firebaseInitialized = true
    }
  } else {
    firebaseInitialized = true
  }
} catch (e: any) {
  firebaseInitError = e.message || "Unknown init error"
  console.error("Firebase admin init error:", e)
}

export async function sendPushNotification(userId: string, payload: Record<string, unknown>) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId }
  })

  const notifications = subscriptions.map(sub => {
    // Check if it's an FCM native token
    if (sub.endpoint.startsWith("fcm:")) {
      if (!firebaseInitialized) {
        throw new Error("FIREBASE INIT FAILED: " + firebaseInitError);
      }
      
      const token = sub.endpoint.replace("fcm:", "")
      const isAlarm = payload.type === 'ALARM';
      const message: any = {
        ...(isAlarm ? {} : {
          notification: {
            title: payload.title as string,
            body: payload.body as string,
          }
        }),
        data: payload as Record<string, string>,
        token: token,
        android: {
          priority: "high" as const,
          ...(isAlarm ? {} : {
            notification: {
              channelId: "sos_alarms",
              sound: "default"
            }
          })
        }
      }
      
      return getMessaging().send(message)
        .catch((error: any) => {
          console.error("Firebase push error:", error)
          if (error.code === 'messaging/registration-token-not-registered') {
            return prisma.pushSubscription.delete({ where: { id: sub.id } })
          }
          throw new Error("FIREBASE SEND ERROR: " + error.message);
        })
    } 
    
    // Otherwise, handle as standard Web Push
    else {
      if (!publicKey || !privateKey) return Promise.resolve()
      
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }
      
      return webpush.sendNotification(pushSubscription, JSON.stringify(payload))
        .catch((error: any) => {
          console.error("Web push error:", error)
          if (error.statusCode === 410 || error.statusCode === 404) {
            return prisma.pushSubscription.delete({ where: { id: sub.id } })
          }
        })
    }
  })

  await Promise.all(notifications)
}

export async function broadcastPushNotification(payload: Record<string, unknown>) {
  const subscriptions = await prisma.pushSubscription.findMany()

  const notifications = subscriptions.map(sub => {
    // Check if it's an FCM native token
    if (sub.endpoint.startsWith("fcm:")) {
      if (!firebaseInitialized) return Promise.resolve()
      
      const token = sub.endpoint.replace("fcm:", "")
      const isAlarm = payload.type === 'ALARM';
      const message: any = {
        ...(isAlarm ? {} : {
          notification: {
            title: payload.title as string,
            body: payload.body as string,
          }
        }),
        data: payload as Record<string, string>,
        token: token,
        android: { priority: "high" as const, ...(isAlarm ? {} : { notification: { channelId: "sos_alarms", sound: "default" } }) }
      }
      
      return getMessaging().send(message)
        .catch((error: any) => {
          console.error("Firebase push error:", error)
          if (error.code === 'messaging/registration-token-not-registered') {
            return prisma.pushSubscription.delete({ where: { id: sub.id } })
          }
        })
    } 
    
    // Otherwise, handle as standard Web Push
    else {
      if (!publicKey || !privateKey) return Promise.resolve()
      
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }
      
      return webpush.sendNotification(pushSubscription, JSON.stringify(payload))
        .catch((error: any) => {
          console.error("Web push error:", error)
          if (error.statusCode === 410 || error.statusCode === 404) {
            return prisma.pushSubscription.delete({ where: { id: sub.id } })
          }
        })
    }
  })

  await Promise.all(notifications)
}
