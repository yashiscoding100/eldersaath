
export async function sendAdminNotification(userId: string, title: string, body: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return { success: false, message: 'Unauthorized' }

  try {
    if (userId === "ALL") {
      const { broadcastPushNotification } = await import('@/lib/push')
      await broadcastPushNotification({ title, body, url: '/' })
      return { success: true, message: 'Broadcast sent to all devices.' }
    } else {
      await sendPushNotification(userId, { title, body, url: '/' })
      return { success: true, message: 'Notification sent to user.' }
    }
  } catch (e: any) {
    return { success: false, message: e.message || 'Push Error' }
  }
}
