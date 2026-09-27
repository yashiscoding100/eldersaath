import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getApps } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"
import { firebaseInitError, firebaseInitialized } from "@/lib/push"

export async function GET() {
  try {
    const fcmSubs = await prisma.pushSubscription.findMany({
      where: { endpoint: { startsWith: "fcm:" } }
    })
    
    const webCount = await prisma.pushSubscription.count({
      where: { NOT: { endpoint: { startsWith: "fcm:" } } }
    })

    const hasFirebaseEnv = !!process.env.FIREBASE_PROJECT_ID && !!process.env.FIREBASE_CLIENT_EMAIL && !!process.env.FIREBASE_PRIVATE_KEY
    const isFirebaseInit = getApps().length > 0
    
    const testResults: any[] = []
    
    if (isFirebaseInit) {
      for (const sub of fcmSubs) {
        try {
          const token = sub.endpoint.replace("fcm:", "")
          const message = {
            data: { type: "DEBUG_PING" },
            token: token
          }
          const response = await getMessaging().send(message)
          testResults.push({ id: sub.id, status: "SUCCESS", response })
        } catch (e: any) {
          testResults.push({ id: sub.id, status: "ERROR", error: e.message, code: e.code })
        }
      }
    }
    
    return NextResponse.json({
      fcmTokens: fcmSubs.length,
      webTokens: webCount,
      firebaseEnvFound: hasFirebaseEnv,
      firebaseInitialized: isFirebaseInit,
      localStateInit: firebaseInitialized,
      error: firebaseInitError,
      testResults
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}