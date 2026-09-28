import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const data = await req.json()
    const { bloodGroup, allergies, medicalConditions, preferredHospital, notes } = data
    
    // Determine which elder ID to update
    let targetUserId = session.user.id
    if (session.user.role === "CHILD") {
       // If it's a child, they must pass the elderId in the body (if they are editing it from their dashboard)
       if (data.elderId) {
          const rel = await prisma.caregiverRelationship.findUnique({ where: { elderId_childId: { elderId: data.elderId, childId: session.user.id } }})
          if (!rel || rel.status !== "ACTIVE") return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
          targetUserId = data.elderId
       }
    }

    await prisma.elderProfile.upsert({
      where: { userId: targetUserId },
      update: { bloodGroup, allergies, medicalConditions, preferredHospital, notes },
      create: { userId: targetUserId, bloodGroup, allergies, medicalConditions, preferredHospital, notes }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}