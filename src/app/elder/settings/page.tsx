import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ScheduleSettings } from "./ScheduleSettings"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ElderSettings() {
  const session = await auth()
  
  if (!session || session.user.role !== "ELDER") {
    redirect("/login")
  }

  const profile = await prisma.elderProfile.findUnique({
    where: { userId: session.user.id }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
          <Link href="/elder/home" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Your Settings</h1>
        </div>

        <ScheduleSettings 
          initialDays={profile?.vitalCheckDays || "0,1,2,3,4,5,6"} 
        />
      </div>
    </div>
  )
}
