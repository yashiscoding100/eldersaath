import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// For real IoT devices, we would use a secret API key or JWT rather than NextAuth sessions
// since the device itself is authenticating.

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (authHeader !== "Bearer DEVICE_SECRET_KEY") {
        return NextResponse.json({ message: "Unauthorized Device" }, { status: 401 })
    }

    const { deviceId, elderId, type, value, unit } = await req.json()
    
    // In a real scenario, we'd verify the device is registered to this elder
    await prisma.healthMeasurement.create({
      data: {
        elderId,
        type,
        value: String(value),
        unit,
        source: "DEVICE"
      }
    })

    console.log(`[IoT] Received ${type} reading from device ${deviceId}`)
    
    return NextResponse.json({ message: "Reading logged" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to process IoT data" }, { status: 500 })
  }
}
