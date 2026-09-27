import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ELDER") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { vitalCheckDays } = await req.json()

    await prisma.elderProfile.update({
      where: { userId: session.user.id },
      data: { vitalCheckDays }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update elder settings:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
