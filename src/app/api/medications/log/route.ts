import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ELDER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { medicationId, status } = await req.json()

    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
    })

    if (!medication || medication.elderId !== session.user.id) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    const log = await prisma.medicationLog.create({
      data: {
        medicationId,
        elderId: session.user.id,
        status, // TAKEN, MISSED, SKIPPED, SNOOZED
      }
    })
    
    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to log medication" }, { status: 500 })
  }
}
