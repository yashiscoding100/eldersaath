import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "CHILD") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { elderId, requiredVitals } = await req.json()

    if (!elderId || typeof requiredVitals !== "string") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
    }

    // Verify relationship
    const relationship = await prisma.caregiverRelationship.findUnique({
      where: {
        elderId_childId: { elderId, childId: session.user.id }
      }
    })

    if (!relationship) {
      return NextResponse.json({ message: "Unauthorized for this elder" }, { status: 403 })
    }

    // Update or create elder profile with new requiredVitals
    const updatedProfile = await prisma.elderProfile.upsert({
      where: { userId: elderId },
      update: { requiredVitals },
      create: {
        userId: elderId,
        requiredVitals
      }
    })

    return NextResponse.json({ 
      message: "Preferences updated successfully",
      profile: updatedProfile
    })
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.elderProfile.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ 
      requiredVitals: profile?.requiredVitals || "BP,SUGAR,SPO2,PULSE,TEMP,WEIGHT"
    })
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
