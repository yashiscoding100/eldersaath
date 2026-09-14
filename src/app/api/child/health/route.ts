import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { elderId, bp, sugar, spo2, pulse } = data
    
    // Verify relationship
    const rel = await prisma.caregiverRelationship.findFirst({
      where: { childId: session.user.id, elderId, status: "ACTIVE" }
    })
    
    if (!rel) {
      return NextResponse.json({ message: "Not linked to this elder" }, { status: 403 })
    }

    const measurements: { type: string; value: string; unit: string }[] = []
    
    if (bp) measurements.push({ type: "BP", value: bp, unit: "mmHg" })
    if (sugar) measurements.push({ type: "SUGAR", value: sugar, unit: "mg/dL" })
    if (spo2) measurements.push({ type: "SPO2", value: spo2, unit: "%" })
    if (pulse) measurements.push({ type: "PULSE", value: pulse, unit: "BPM" })
    
    for (const m of measurements) {
      await prisma.healthMeasurement.create({
        data: {
          elderId: elderId,
          type: m.type,
          value: m.value,
          unit: m.unit,
          source: "CAREGIVER" // explicitly logged by family member
        }
      })
    }

    return NextResponse.json({ message: "Saved successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to save health data" }, { status: 500 })
  }
}
