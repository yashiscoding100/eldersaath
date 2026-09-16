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
        longitude,
        escalationLevel: 1 // Start at primary caregiver
      }
    })
    
    // Feature 5: Emergency Escalation - Fetch Primary Caregivers
    const primaryCaregivers = await prisma.caregiverRelationship.findMany({
      where: { elderId: session.user.id, priority: 1, status: "ACTIVE" },
      include: { child: true }
    })

    const phoneNumbers = primaryCaregivers.map(rel => rel.child.email) // Fallback to email as ID
    
    // MOCK SMS PROVIDER: In production this would be Twilio
    console.log(`[EMERGENCY ESCALATION LEVEL 1]: Contacting Primary Caregivers: ${phoneNumbers.join(', ')}`)
    console.log(`EMERGENCY: Elder ${session.user.name} triggered SOS at lat: ${latitude}, lng: ${longitude}`)
    
    return NextResponse.json({ message: "Emergency contacts alerted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to trigger SOS" }, { status: 500 })
  }
}
