import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/LogoutButton"
import { TestAlarmButton } from "./TestAlarmButton"
import { PendingConnections } from "./PendingConnections"
import { GlobalNotice } from "@/components/GlobalNotice"
import { HealthCharts } from "@/components/HealthCharts"

export default async function ElderHome() {
  const session = await auth()

  if (!session || session.user.role !== "ELDER") {
    redirect("/login")
  }

  // Get today's data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const allMeasurements = await prisma.healthMeasurement.findMany({
    where: { elderId: session.user.id, timestamp: { gte: thirtyDaysAgo } },
  })
  
  const todayMeasurements = allMeasurements.filter(m => m.timestamp >= today)

  const medications = await prisma.medication.findMany({
    where: { elderId: session.user.id },
    include: {
      logs: {
        where: { timestamp: { gte: today } }
      }
    }
  })

  // Get pending connection requests
  const pendingRequests = await prisma.caregiverRelationship.findMany({
    where: { elderId: session.user.id, status: "PENDING" },
    include: { child: { select: { name: true, email: true } } }
  })

  const totalMeds = medications.length
  const takenMeds = medications.filter(m => m.logs.some(l => l.status === "TAKEN")).length
  const healthCheckDone = todayMeasurements.length > 0

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-8">
      {/* Premium Header */}
      <div className="w-full bg-white shadow-sm border-b border-slate-200 mb-6">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hello, {session.user.name?.split(" ")[0]}!</h1>
            <p className="text-slate-500 font-medium mt-1">Here is your daily care schedule.</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="w-full max-w-4xl px-6 space-y-6 flex-1">
        
        <GlobalNotice />
        <PendingConnections requests={pendingRequests} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Check - Main Action Button */}
          <a href="/elder/checkin" className={`block w-full rounded-2xl p-6 text-left transition-all transform hover:-translate-y-1 shadow-sm border flex flex-col justify-between h-full ${
            healthCheckDone 
              ? 'bg-emerald-50 border-emerald-200 hover:shadow-emerald-100' 
              : 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700 hover:shadow-blue-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${healthCheckDone ? 'bg-emerald-100' : 'bg-blue-500'}`}>
                🩺
              </div>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${healthCheckDone ? 'text-emerald-800' : 'text-white'}`}>Health Check</h2>
              <p className={`text-sm font-medium mt-1 ${healthCheckDone ? 'text-emerald-600' : 'text-blue-100'}`}>
                {healthCheckDone ? '✅ Completed today' : 'Tap here to record vitals'}
              </p>
            </div>
          </a>

          {/* Medicines */}
          <a href="/elder/medications" className="block w-full bg-white rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between border border-slate-200 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl">
                💊
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Medicines</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {totalMeds > 0 ? `${takenMeds} out of ${totalMeds} taken` : 'No medicines today'}
              </p>
            </div>
          </a>

          {/* Tasks */}
          <a href="/elder/tasks" className="block w-full bg-white rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between border border-slate-200 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Daily Tasks</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Check your family messages</p>
            </div>
          </a>

          {/* Games */}
          <a href="/elder/games" className="block w-full bg-white rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 flex flex-col justify-between border border-slate-200 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-2xl">
                🧩
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Brain Games</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Keep your mind sharp</p>
            </div>
          </a>
        </div>

        {/* Historical Health Trends */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">My Health Trends</h2>
          <HealthCharts measurements={allMeasurements} variant="elder" />
        </div>

        <div className="pt-2">
          <TestAlarmButton />
        </div>

        {/* SOS Button - Still prominent but cleaner */}
        <div className="w-full mt-6">
          <a href="/elder/sos" className="block w-full bg-red-600 text-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-red-700 transition-all text-center border border-red-700 relative overflow-hidden flex items-center justify-center gap-3">
            <span className="text-2xl">🚨</span>
            <span className="font-bold text-2xl tracking-wide">SOS Emergency Help</span>
            <span className="text-2xl">🚨</span>
          </a>
        </div>
      </div>
    </div>
  )
}
