import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { elderId } = await req.json()
    
    if (elderId) {
      const cookieStore = await cookies()
      cookieStore.set("activeElderId", elderId, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}
