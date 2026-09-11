import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/LogoutButton"
import { TestAlarmButton } from "./TestAlarmButton"

export default async function ElderHome() {
  const session = await auth()

  if (!session || session.user.role !== "ELDER") {
    redirect("/login")
  }

  // Get today's data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayMeasurements = await prisma.healthMeasurement.findMany({
    where: { elderId: session.user.id, timestamp: { gte: today } },
  })

  const medications = await prisma.medication.findMany({
    where: { elderId: session.user.id },
    include: {
      logs: {
        where: { timestamp: { gte: today } }
      }
    }
  })

  const totalMeds = medications.length
  const takenMeds = medications.filter(m => m.logs.some(l => l.status === "TAKEN")).length
  const healthCheckDone = todayMeasurements.length > 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-md p-6 bg-white shadow-sm pb-8 rounded-b-3xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-extrabold text-gray-900">Hello, {session.user.name?.split(" ")[0]}</h1>
          <LogoutButton />
        </div>
        <p className="text-xl text-gray-600">Here is what you need to do today.</p>
      </div>

      <div className="w-full max-w-md p-6 space-y-4 mt-4 flex-1">
        
        <a href="/elder/checkin" className={`block w-full rounded-2xl p-6 text-left shadow-sm transition-colors flex items-center justify-between border ${
          healthCheckDone ? 'bg-green-50 border-green-200' : 'bg-blue-100 hover:bg-blue-200 border-blue-200'
        }`}>
          <div>
            <h2 className={`text-2xl font-bold ${healthCheckDone ? 'text-green-800' : 'text-blue-900'}`}>Health Check</h2>
            <p className={`text-lg opacity-80 mt-1 ${healthCheckDone ? 'text-green-700' : ''}`}>
              {healthCheckDone ? '✅ Completed today' : 'Tap here to record your vitals'}
            </p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            ❤️
          </div>
        </a>

        <a href="/elder/medications" className="block w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-2xl p-6 text-left shadow-sm transition-colors flex items-center justify-between border border-emerald-200">
          <div>
            <h2 className="text-2xl font-bold">Medicines</h2>
            <p className="text-lg opacity-80 mt-1">
              {totalMeds > 0 ? `${takenMeds}/${totalMeds} taken today` : 'No medicines scheduled'}
            </p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            💊
          </div>
        </a>

        <a href="/elder/tasks" className="block w-full bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-2xl p-6 text-left shadow-sm transition-colors flex items-center justify-between border border-purple-200">
          <div>
            <h2 className="text-2xl font-bold">Daily Tasks</h2>
            <p className="text-lg opacity-80 mt-1">Check your assigned tasks</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            📝
          </div>
        </a>

        <a href="/elder/games" className="block w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-2xl p-6 text-left shadow-sm transition-colors flex items-center justify-between border border-yellow-200">
          <div>
            <h2 className="text-2xl font-bold">Brain & Wellness</h2>
            <p className="text-lg opacity-80 mt-1">Play memory games</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            🧠
          </div>
        </a>

        <TestAlarmButton />

      </div>

      <div className="w-full max-w-md p-6 mt-auto">
        <a href="/elder/sos" className="block w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl p-6 shadow-lg transition-colors text-center font-bold text-2xl border-4 border-red-200">
          🚨 SOS EMERGENCY
        </a>
      </div>
    </div>
  )
}
