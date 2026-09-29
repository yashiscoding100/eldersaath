import os

content = '''import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendPushNotification } from "@/lib/push"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const data = await req.json()
    const { title, description, elderId, time, triggerAlarm, frequency } = data
    let targetElderId = elderId
    
    if (session.user.role === "ELDER") {
      targetElderId = session.user.id
    } else if (session.user.role === "CHILD") {
      const relationship = await prisma.caregiverRelationship.findUnique({
        where: { elderId_childId: { elderId: targetElderId, childId: session.user.id } }
      })
      if (!relationship || relationship.status !== "ACTIVE") return NextResponse.json({ message: "Unauthorized for this elder" }, { status: 403 })
    } else {
      return NextResponse.json({ message: "Unauthorized role" }, { status: 401 })
    }

    const task = await prisma.task.create({
      data: { elderId: targetElderId, assignerId: session.user.id, title, description, time, triggerAlarm: triggerAlarm === true, frequency: frequency || "DAILY" }
    })
    
    if (session.user.role === "CHILD") {
      await sendPushNotification(targetElderId, {
        title: "New Thing to Do",
        body: session.user.name + " added a new thing to do: " + title,
        url: "/elder/home"
      })
    }
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 })

    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) return NextResponse.json({ message: "Not found" }, { status: 404 })

    if (session.user.role === "CHILD") {
      const rel = await prisma.caregiverRelationship.findUnique({
        where: { elderId_childId: { elderId: task.elderId, childId: session.user.id } }
      })
      if (!rel || rel.status !== "ACTIVE") return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    } else if (session.user.role === "ELDER" && task.elderId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}'''

with open('src/app/api/tasks/route.ts', 'w', encoding='utf-8') as f: f.write(content)

content2 = '''"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteTaskButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this?")) return
    setLoading(true)
    try {
      await fetch("/api/tasks?id=" + id, { method: "DELETE" })
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-700 disabled:opacity-50 text-sm font-medium">
      {loading ? "..." : "Delete"}
    </button>
  )
}'''

with open('src/app/child/tasks/DeleteTaskButton.tsx', 'w', encoding='utf-8') as f: f.write(content2)
