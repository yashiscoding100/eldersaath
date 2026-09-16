import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function DELETE(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "Link ID is required" }, { status: 400 })
    }

    await prisma.caregiverRelationship.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Connection severed" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to sever connection" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { elderEmail, childEmail } = await req.json()

    if (!elderEmail || !childEmail) {
      return NextResponse.json({ message: "Both emails are required" }, { status: 400 })
    }

    const elder = await prisma.user.findUnique({ where: { email: elderEmail } })
    const child = await prisma.user.findUnique({ where: { email: childEmail } })

    if (!elder || elder.role !== "ELDER") {
      return NextResponse.json({ message: "Elder not found or invalid role" }, { status: 404 })
    }

    if (!child || child.role !== "CHILD") {
      return NextResponse.json({ message: "Family member not found or invalid role" }, { status: 404 })
    }

    // Check if relationship already exists
    const existing = await prisma.caregiverRelationship.findFirst({
      where: { elderId: elder.id, childId: child.id }
    })

    if (existing) {
      // If it exists but is pending, just upgrade it to active. Otherwise error.
      if (existing.status === "PENDING") {
        await prisma.caregiverRelationship.update({
          where: { id: existing.id },
          data: { status: "ACTIVE" }
        })
        return NextResponse.json({ message: "Upgraded pending connection to ACTIVE" }, { status: 200 })
      }
      return NextResponse.json({ message: "Connection already exists" }, { status: 400 })
    }

    await prisma.caregiverRelationship.create({
      data: {
        elderId: elder.id,
        childId: child.id,
        status: "ACTIVE" // Admins bypass the pending state!
      }
    })

    return NextResponse.json({ message: "Connection created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create connection" }, { status: 500 })
  }
}
