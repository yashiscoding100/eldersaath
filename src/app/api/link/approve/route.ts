import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ELDER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { relationshipId, action } = await req.json()

    // Verify this relationship belongs to the logged-in elder
    const relationship = await prisma.caregiverRelationship.findUnique({
      where: { id: relationshipId }
    })

    if (!relationship || relationship.elderId !== session.user.id) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 })
    }

    if (action === "APPROVE") {
      await prisma.caregiverRelationship.update({
        where: { id: relationshipId },
        data: { status: "ACTIVE" }
      })
      return NextResponse.json({ message: "Approved" }, { status: 200 })
    } else if (action === "REJECT") {
      await prisma.caregiverRelationship.delete({
        where: { id: relationshipId }
      })
      return NextResponse.json({ message: "Rejected" }, { status: 200 })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 })
  }
}
