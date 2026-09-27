import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notifyVitals: true }
    })

    return NextResponse.json({ notifyVitals: user?.notifyVitals ?? true })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    const { notifyVitals } = await req.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: { notifyVitals }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
