import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPushNotification } from "@/lib/push"

export async function GET(req: Request) {
  try {
    const now = new Date()
    const currentHours = now.getHours().toString().padStart(2, '0')
    const currentMinutes = now.getMinutes().toString().padStart(2, '0')
    const currentTimeString = `${currentHours}:${currentMinutes}` // "HH:MM"

    const medications = await prisma.medication.findMany({
      where: { time: currentTimeString },
      include: { elder: true }
    })

    let sent = 0
    for (const med of medications) {
      // Avoid duplicate alerts by checking logs today
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      
      const existingLog = await prisma.medicationLog.findFirst({
        where: { medicationId: med.id, timestamp: { gte: startOfDay } }
      })

      if (!existingLog) {
        // Send Push to Elder
        await sendPushNotification(med.elderId, {
          title: "Medicine Time",
          body: `It's time to take ${med.name} (${med.dosage})`,
          url: "/elder/medications"
        })
        sent++
      }
    }

    return NextResponse.json({ message: `Sent ${sent} med reminders` }, { status: 200 })
  } catch (error) {
    console.error("Medication Cron Error", error)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
