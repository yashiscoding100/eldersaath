import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || (session.user.role !== "CHILD" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { emergencyId } = await req.json()
    
    // Find the emergency to get the elderId
    const emergency = await prisma.emergencyEvent.findUnique({
      where: { id: emergencyId }
    })

    if (!emergency) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    // Resolve ALL active emergencies for this elder (in case they tapped SOS multiple times)
    await prisma.emergencyEvent.updateMany({
      where: { 
        elderId: emergency.elderId,
        status: "ACTIVE"
      },
      data: {
        status: "RESOLVED",
        acknowledgedBy: session.user.id,
        acknowledgedAt: new Date(),
        resolvedAt: new Date()
      }
    })
    
    return NextResponse.json({ message: "Emergency resolved" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to resolve emergency" }, { status: 500 })
  }
}
