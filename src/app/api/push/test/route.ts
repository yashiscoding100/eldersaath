import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { sendPushNotification } from "@/lib/push"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const data = await req.json()
    
    if (data.type === "ALARM") {
      await sendPushNotification(session.user.id, {
        type: "ALARM", 
        label: "TEST ALARM",
        body: "This is a test alarm.",
        snoozeText: "Take later",
        elderId: session.user.id
      })
    } else {
      await sendPushNotification(session.user.id, {
        title: "Test Notification",
        body: "This is a standard test notification.",
        url: "/"
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Test Push Error:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}