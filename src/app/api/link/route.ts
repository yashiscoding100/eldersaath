import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { email } = await req.json()

    const elderUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!elderUser || elderUser.role !== "ELDER") {
      return NextResponse.json({ message: "Elder account not found" }, { status: 404 })
    }

    const relationship = await prisma.caregiverRelationship.create({
      data: {
        elderId: elderUser.id,
        childId: session.user.id,
        status: "ACTIVE", // Auto-active for simplicity in this phase
      },
    })

    return NextResponse.json(relationship, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to link account" }, { status: 500 })
  }
}
