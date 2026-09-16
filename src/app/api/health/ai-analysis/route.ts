import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const elderId = searchParams.get("elderId")

  if (!elderId) {
    return NextResponse.json({ message: "Elder ID required" }, { status: 400 })
  }

  // Ensure relationship
  const rel = await prisma.caregiverRelationship.findUnique({
    where: { elderId_childId: { elderId, childId: session.user.id } }
  })

  if (!rel || rel.status !== "ACTIVE") {
    return NextResponse.json({ message: "Not authorized to view this elder" }, { status: 403 })
  }

  // Fetch last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const measurements = await prisma.healthMeasurement.findMany({
    where: { elderId, timestamp: { gte: thirtyDaysAgo } },
    orderBy: { timestamp: 'asc' }
  })

  if (measurements.length < 3) {
    return NextResponse.json({ 
      insight: "Not enough recent data to generate a trend analysis. Keep recording measurements.",
      isFallback: true 
    })
  }

  // Fallback Deterministic Logic (Rule-based)
  let insight = "Your elder's health metrics appear stable."
  let issues = []

  const bpMeasurements = measurements.filter(m => m.type === 'BP')
  if (bpMeasurements.length >= 3) {
    const recentBPs = bpMeasurements.slice(-3).map(m => parseInt(m.value.split('/')[0]) || 0)
    const isRising = recentBPs[0] < recentBPs[1] && recentBPs[1] < recentBPs[2]
    const isHigh = recentBPs.some(sys => sys > 140)
    
    if (isHigh) issues.push("recent blood pressure readings are above 140 systolic")
    if (isRising) issues.push("there is a gradual upward trend in systolic blood pressure")
  }

  const sugarMeasurements = measurements.filter(m => m.type === 'SUGAR')
  if (sugarMeasurements.length >= 3) {
    const recentSugars = sugarMeasurements.slice(-3).map(m => parseFloat(m.value) || 0)
    const isHigh = recentSugars.some(s => s > 180)
    if (isHigh) issues.push("some blood sugar readings have spiked over 180")
  }

  if (issues.length > 0) {
    insight = `We noticed that ${issues.join(" and ")}. Consider discussing this trend with a healthcare professional.`
  }

  return NextResponse.json({
    insight,
    isFallback: true,
    disclaimer: "This is a health-data trend, not a medical diagnosis."
  })
}
