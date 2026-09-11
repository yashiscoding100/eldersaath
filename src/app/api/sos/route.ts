import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ELDER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { latitude, longitude } = await req.json()
    
    const event = await prisma.emergencyEvent.create({
      data: {
        elderId: session.user.id,
        latitude,
        longitude
      }
    })
    
    // In a real app, this would trigger Twilio SMS, push notifications, etc.
    console.log(`EMERGENCY: Elder ${session.user.name} triggered SOS at lat: ${latitude}, lng: ${longitude}`)
    
    return NextResponse.json({ message: "Emergency contacts alerted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to trigger SOS" }, { status: 500 })
  }
}
