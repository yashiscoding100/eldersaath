
export async function broadcastPushNotification(payload: Record<string, unknown>) {
  const subscriptions = await prisma.pushSubscription.findMany()

  const notifications = subscriptions.map(sub => {
    // Check if it's an FCM native token
    if (sub.endpoint.startsWith("fcm:")) {
      if (!firebaseInitialized) return Promise.resolve()
      
      const token = sub.endpoint.replace("fcm:", "")
      const message = {
        notification: {
          title: payload.title as string,
          body: payload.body as string,
        },
        data: payload as Record<string, string>,
        token: token,
        android: {
          priority: "high" as const,
          notification: {
            channelId: "sos_alarms",
            sound: "default"
          }
        }
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
