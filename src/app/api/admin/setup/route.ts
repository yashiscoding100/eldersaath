import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Secret key for MVP to promote a user to ADMIN.
// In a real app, this should be an environment variable.
const SETUP_SECRET = "make-me-admin-123"

export async function POST(req: Request) {
  try {
    const { email, secret } = await req.json()

    if (secret !== SETUP_SECRET) {
      return NextResponse.json({ message: "Invalid secret key" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    })

    return NextResponse.json({ message: `Success! ${email} is now an ADMIN.` }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: "Failed to promote user" }, { status: 500 })
  }
}
