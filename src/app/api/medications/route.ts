import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "CHILD") return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  try {
    const { elderId, name, dosage, frequency, time, instructions } = await req.json()
    const rel = await prisma.caregiverRelationship.findUnique({ where: { elderId_childId: { elderId, childId: session.user.id } } })
    if (!rel || rel.status !== "ACTIVE") return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    const medication = await prisma.medication.create({ data: { elderId, name, dosage, frequency, time, instructions } })
    return NextResponse.json(medication, { status: 201 })
  } catch (error) { return NextResponse.json({ message: "Error" }, { status: 500 }) }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  try {
    if (session.user.role === "ELDER") {
      const today = new Date(); today.setHours(0,0,0,0)
      const meds = await prisma.medication.findMany({ where: { elderId: session.user.id }, include: { logs: { where: { timestamp: { gte: today } } } } })
      return NextResponse.json(meds, { status: 200 })
    }
    return NextResponse.json({ message: "Not implemented for child" }, { status: 400 })
  } catch (error) { return NextResponse.json({ message: "Error" }, { status: 500 }) }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "CHILD") return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ message: "ID missing" }, { status: 400 })

    const med = await prisma.medication.findUnique({ where: { id } })
    if (!med) return NextResponse.json({ message: "Not found" }, { status: 404 })

    // Verify child has access to this elder
    const rel = await prisma.caregiverRelationship.findUnique({ where: { elderId_childId: { elderId: med.elderId, childId: session.user.id } } })
    if (!rel || rel.status !== "ACTIVE") return NextResponse.json({ message: "Unauthorized" }, { status: 403 })

    await prisma.medication.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" }, { status: 200 })
  } catch (error) { return NextResponse.json({ message: "Error" }, { status: 500 }) }
}
