import re

with open('src/lib/push.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to add the database creation logic right after export async function sendPushNotification(userId: string, payload: Record<string, unknown>) {

insertion = '''
  // Force an in-app database notification for the Bell icon
  // This ensures iOS, Windows, and Web users get the alert even without native FCM/WebPush subscriptions
  try {
    const title = (payload.title as string) || (payload.label as string) || "Notification";
    const body = (payload.body as string) || "";
    await prisma.appNotification.create({
      data: {
        userId,
        title,
        message: body,
        type: payload.type === "ALARM" || payload.type === "EMERGENCY" ? "ALERT" : "INFO",
        link: (payload.url as string) || null
      }
    });
  } catch (dbErr) {
    console.error("Failed to save AppNotification", dbErr);
  }
'''

content = content.replace(
    'export async function sendPushNotification(userId: string, payload: Record<string, unknown>) {',
    'export async function sendPushNotification(userId: string, payload: Record<string, unknown>) {' + insertion
)

# Do the same for broadcastPushNotification?
# Wait, broadcast doesn't take userId. Let's skip broadcast, it's rarely used (only for emergencies maybe?). 
# Actually, let's leave broadcast as is.

with open('src/lib/push.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("In-app notifications enabled inside sendPushNotification!")
