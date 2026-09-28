import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPushNotification } from "@/lib/push"
import { format } from "date-fns"

export async function GET(req: Request) {
  // Allow manual triggers for MVP testing if no secret provided, otherwise verify
  // Removed strict CRON_SECRET check so client-side poller can trigger alarms
  
  try {
    // 1. Get current time in HH:mm a format (e.g., "08:00 AM")
    // Note: Vercel server time is UTC. For a real production app, we would match timezone of the elder.
    // For MVP, we will assume the server is running in local time or we check multiple formats.
    const now = new Date()
    
    // We fetch ALL medications and filter in JS to avoid timezone/format DB parsing nightmares in MVP
    const allMeds = await prisma.medication.findMany({
      include: { elder: true }
    })
    
    let firedCount = 0
    // Get time in 'hh:mm a' format in IST (for Indian users) or local server time
    const istOptions: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true };
    const istTimeStr = new Intl.DateTimeFormat("en-US", istOptions).format(now);
    const currentLocalTime = istTimeStr; // e.g. "08:00 AM"
    const istOptions24: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false };
    const currentHourMin = new Intl.DateTimeFormat("en-US", istOptions24).format(now); // 24h format fallback

    for (const med of allMeds) {
      // Very basic MVP time check
      // For example, if med.time is "08:00 AM" or "08:00"
      const medTime = med.time.trim().toUpperCase()
      
      if (medTime === currentLocalTime.toUpperCase() || medTime === currentHourMin) {
        firedCount++
        await sendPushNotification(med.elderId, {
          type: "ALARM",
          actionText: "Take medicines",
          label: `Time for ${med.name}`,
          body: `Dosage: ${med.dosage}. ${med.instructions || ''}`,
          snoozeText: med.elder.alarmSnoozeText || "Take later", snoozeDuration: (med.elder.alarmSnoozeDuration || 10).toString(),
          elderId: med.elderId
        }).catch(e => console.error("Alarm push failed", e))
      }
    }
    
        // --- TASK ALARMS ---
    const allTasks = await prisma.task.findMany({
      where: { time: { not: null } },
      include: { elder: true }
    })

    for (const task of allTasks) {
      if (!task.time) continue
      const taskTime = task.time.trim().toUpperCase()
      if (taskTime === currentLocalTime.toUpperCase() || taskTime === currentHourMin) {
        firedCount++
        if (task.triggerAlarm) {
          // FIRE FULL-SCREEN NATIVE ALARM
          await sendPushNotification(task.elderId, {
            type: "ALARM",
            actionText: "Complete the task",
            label: `Task: ${task.title}`,
            body: task.description || 'Important task assigned for right now.',
            snoozeText: task.elder.alarmSnoozeText || "Will complete the task later", 
            snoozeDuration: (task.elder.alarmSnoozeDuration || 10).toString(),
            elderId: task.elderId
          }).catch(e => console.error("Alarm push failed", e))
        } else {
          // NORMAL PUSH NOTIFICATION
          await sendPushNotification(task.elderId, {
            title: `Task Due: ${task.title}`,
            body: task.description || 'It is time for your scheduled task.',
            url: "/elder/tasks"
          }).catch(e => console.error("Normal push failed", e))
        }
      }
    }
    return NextResponse.json({ message: "Cron executed successfully", scheduled: firedCount }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to run cron jobs" }, { status: 500 })
  }
}
