import webpush from "web-push"
import { prisma } from "./prisma"

// Ensure you generate VAPID keys using `npx web-push generate-vapid-keys`
// and set them in your .env file
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const privateKey = process.env.VAPID_PRIVATE_KEY || ""

if (publicKey && privateKey) {
  webpush.setVapidDetails(
    "mailto:support@eldersaath.com",
    publicKey,
    privateKey
  )
}

export async function sendPushNotification(userId: string, payload: Record<string, unknown>) {
  if (!publicKey || !privateKey) {
    console.warn("VAPID keys not configured. Skipping push notification.")
    return
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId }
  })

  const notifications = subscriptions.map(sub => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    }
    
    return webpush.sendNotification(pushSubscription, JSON.stringify(payload))
      .catch(error => {
        console.error("Error sending push notification, might be expired:", error)
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription has expired or is no longer valid
          return prisma.pushSubscription.delete({ where: { id: sub.id } })
        }
      })
  })

  await Promise.all(notifications)
}
