import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const { title, content } = await req.json()
    const notice = await prisma.notice.create({ data: { title, content } })
    return NextResponse.json(notice, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 })

    await prisma.notice.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 })

    const { isActive } = await req.json()
    await prisma.notice.update({ where: { id }, data: { isActive } })
    return NextResponse.json({ message: "Updated" }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
