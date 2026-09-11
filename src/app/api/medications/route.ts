import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { elderId, name, dosage, frequency, time, instructions } = await req.json()

    // Verify relationship
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

    const medication = await prisma.medication.create({
      data: {
        elderId,
        name,
        dosage,
        frequency,
        time,
        instructions
      }
    })
    
    return NextResponse.json(medication, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to add medication" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    // If elder, fetch their own meds
    if (session.user.role === "ELDER") {
      const today = new Date()
      today.setHours(0,0,0,0)

      const meds = await prisma.medication.findMany({
        where: { elderId: session.user.id },
        include: {
          logs: {
            where: { timestamp: { gte: today } }
          }
        }
      })
      return NextResponse.json(meds, { status: 200 })
    }
    
    return NextResponse.json({ message: "Not implemented for child" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch medications" }, { status: 500 })
  }
}
