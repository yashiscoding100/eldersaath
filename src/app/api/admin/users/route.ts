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
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "User deleted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 })
  }
}
