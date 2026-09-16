import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { emergencyId } = await req.json()
    
    await prisma.emergencyEvent.update({
      where: { id: emergencyId },
      data: {
        status: "RESOLVED",
        acknowledgedBy: session.user.id,
        acknowledgedAt: new Date(),
        resolvedAt: new Date()
      }
    })
    
    return NextResponse.json({ message: "Emergency resolved" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to resolve emergency" }, { status: 500 })
  }
}
