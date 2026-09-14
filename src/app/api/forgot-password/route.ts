import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user doesn't exist for security reasons (don't leak emails)
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 })
    }

    // Generate random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Expires in 1 hour
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })

    // In a production app, we would use Resend, SendGrid, etc. to email this link.
    // For this MVP/Interview Demo, we will return the link directly in the UI so the user can test the flow.
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    return NextResponse.json({ 
        message: `DEMO MODE: Since we don't have an email server configured, here is your reset link to test the flow: ${resetUrl}` 
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: "Failed to process request" }, { status: 500 })
  }
}
