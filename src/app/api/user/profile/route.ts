import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, email } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 })
    }

    // Check if email is being changed and is already in use by another account
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser) {
        return NextResponse.json({ message: "Email is already in use" }, { status: 409 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email }
    })

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: { name: updatedUser.name, email: updatedUser.email } 
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
