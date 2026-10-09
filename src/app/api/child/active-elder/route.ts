import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const elderId = searchParams.get("elderId")
    const redirectUrl = searchParams.get("redirect") || "/child/dashboard"
    
    if (elderId) {
      const cookieStore = await cookies()
      cookieStore.set("activeElderId", elderId, {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })
    }

    return NextResponse.redirect(new URL(redirectUrl, req.url))
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 })
  }
}