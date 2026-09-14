import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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
