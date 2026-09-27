import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getApps } from "firebase-admin/app"

export async function GET() {
  try {
    const fcmCount = await prisma.pushSubscription.count({
      where: { endpoint: { startsWith: "fcm:" } }
    })
    
    const webCount = await prisma.pushSubscription.count({
      where: { NOT: { endpoint: { startsWith: "fcm:" } } }
    })

    const hasFirebaseEnv = !!process.env.FIREBASE_PROJECT_ID && !!process.env.FIREBASE_CLIENT_EMAIL && !!process.env.FIREBASE_PRIVATE_KEY
    const isFirebaseInit = getApps().length > 0
    
    return NextResponse.json({
      fcmTokens: fcmCount,
      webTokens: webCount,
      firebaseEnvFound: hasFirebaseEnv,
      firebaseInitialized: isFirebaseInit
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}