import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { elderId, title, description } = await req.json()

    const relationship = await prisma.caregiverRelationship.findUnique({
      where: {
        elderId_childId: {
          elderId,
          childId: session.user.id
        }
      }
    })

    if (!relationship || relationship.status !== "ACTIVE") {
       return NextResponse.json({ message: "Unauthorized for this elder" }, { status: 403 })
    }

    const task = await prisma.task.create({
      data: {
        elderId,
        assignerId: session.user.id,
        title,
        description
      }
    })
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 })
  }
}
