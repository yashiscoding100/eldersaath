import os

content = '''import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendPushNotification } from "@/lib/push"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { title, description, elderId, time, triggerAlarm, frequency } = data
    let targetElderId = elderId
    
    // If elder is creating it for themselves
    if (session.user.role === "ELDER") {
      targetElderId = session.user.id
    } else if (session.user.role === "CHILD") {
      const relationship = await prisma.caregiverRelationship.findUnique({
        where: { elderId_childId: { elderId: targetElderId, childId: session.user.id } }
      })
      if (!relationship || relationship.status !== "ACTIVE") {
         return NextResponse.json({ message: "Unauthorized for this elder" }, { status: 403 })
      }
    } else {
      return NextResponse.json({ message: "Unauthorized role" }, { status: 401 })
    }

    const task = await prisma.task.create({
      data: {
        elderId: targetElderId,
        assignerId: session.user.id,
        title,
        description,
        time,
        triggerAlarm: triggerAlarm === true,
        frequency: frequency || "DAILY"
      }
    })
    
    // Send push notification to the Elder if a Caretaker assigned this task
    if (session.user.role === "CHILD") {
      await sendPushNotification(targetElderId, {
        title: "New Thing to Do",
        body: ${session.user.name} added a new thing to do: ,
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

with open('src/app/api/tasks/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
