import { NextResponse } from "next/server"
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
    const { title, description, elderId, time, triggerAlarm } = data
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
        description
      }
    })
    
    // Send push notification to the Elder if a Caretaker assigned this task
    if (session.user.role === "CHILD") {
      await sendPushNotification(targetElderId, {
        title: "New Task Assigned",
        body: `${session.user.name} added a new task for you: ${title}`,
        url: "/elder/tasks"
      })
    }
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 })
  }
}
