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

  const weightMeasurements = measurements.filter(m => m.type === 'WEIGHT')
  if (weightMeasurements.length >= 2) {
    const recentWeights = weightMeasurements.slice(-7).map(m => parseFloat(m.value) || 0)
    if (recentWeights.length >= 2) {
      const earliest = recentWeights[0]
      const latest = recentWeights[recentWeights.length - 1]
      const diff = latest - earliest
      if (Math.abs(diff) >= 2) { // 2kg change
        issues.push(`there is a rapid weight ${diff > 0 ? 'gain' : 'loss'} of ${Math.abs(diff).toFixed(1)}kg recently`)
      }
    }
  }

  const symptoms = measurements.filter(m => m.type === 'SYMPTOMS' && m.timestamp >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  if (symptoms.length > 0) {
    const recentSymptoms = symptoms.map(m => m.value).join(", ")
    issues.push(`recent symptoms reported (${recentSymptoms})`)
  }

  // Check Missed Check-ins
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentMeasurements = measurements.filter(m => m.timestamp >= sevenDaysAgo)
  const distinctDays = new Set(recentMeasurements.map(m => new Date(m.timestamp).toDateString())).size
  if (distinctDays < 4) {
    issues.push("check-in consistency has declined recently")
  }

  // Check Medication Adherence
  const medLogs = await prisma.medicationLog.findMany({
    where: { 
      medication: { elderId },
      timestamp: { gte: sevenDaysAgo }
    }
  })
  
  if (medLogs.length > 0) {
    const missed = medLogs.filter(l => l.status === "MISSED").length
    const adherence = (medLogs.length - missed) / medLogs.length
    if (adherence < 0.7) {
      issues.push("medication adherence has been unusually low")
    }
  }

  if (issues.length > 0) {
    insight = `We noticed that ${issues.join(", and ")}. You may want to discuss this pattern with a healthcare professional.`
  }

  return NextResponse.json({
    insight,
    isFallback: true,
    disclaimer: "This is a health-data trend, not a medical diagnosis."
  })
}
