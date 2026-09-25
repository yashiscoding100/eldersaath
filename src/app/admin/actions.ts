"use server"

import { auth, signIn } from "@/auth"

export async function impersonateUser(email: string | null) {
  if (!email) throw new Error("No email provided")
  
  const session = await auth()
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  if (!process.env.IMPERSONATION_SECRET) {
    throw new Error("Impersonation secret is not configured on the server")
  }

  // Use the secret to log in as the target user
  await signIn("credentials", {
    email,
    password: process.env.IMPERSONATION_SECRET,
    redirectTo: "/" // Redirect to home/dashboard after successful impersonation
  })
}
import { prisma } from "@/lib/prisma"
import { sendPushNotification } from "@/lib/push"

export async function testAlarm(userId: string) { const session = await auth(); if (session?.user?.role !== 'ADMIN') return { success: false, message: 'Unauthorized' }; const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } }); if (subscriptions.length === 0) return { success: false, message: 'No push subscription found.' }; let sent = 0; for (const sub of subscriptions) { try { await sendPushNotification(userId, { title: 'ALARM TEST', body: 'Test', url: '/' }); sent++; } catch (e: any) { return { success: false, message: e.message || 'Firebase Push Error' }; } } return { success: true, message: 'Sent alarm to ' + sent + ' devices.' }; }
