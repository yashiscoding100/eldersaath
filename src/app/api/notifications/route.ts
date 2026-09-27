import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  
  try {
    const notifications = await prisma.appNotification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const all = searchParams.get("all")

    if (all === "true") {
      await prisma.appNotification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
      })
    } else if (id) {
      await prisma.appNotification.update({
        where: { id, userId: session.user.id },
        data: { isRead: true }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  
  try {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get("all")

    if (all === "true") {
      await prisma.appNotification.deleteMany({
        where: { userId: session.user.id }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
