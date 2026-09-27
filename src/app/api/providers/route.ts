import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { elderId, name, role, phone } = await req.json()

    // Create provider
    const provider = await prisma.careProvider.create({
      data: {
        elderId,
        name,
        role,
        phone
      }
    })
    
    return NextResponse.json(provider, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create provider" }, { status: 500 })
  }
}
