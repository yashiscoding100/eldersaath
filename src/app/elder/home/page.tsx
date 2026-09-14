import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/LogoutButton"
import { TestAlarmButton } from "./TestAlarmButton"
import { PendingConnections } from "./PendingConnections"

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

  // Get pending connection requests
  const pendingRequests = await prisma.caregiverRelationship.findMany({
    where: { elderId: session.user.id, status: "PENDING" },
    include: { child: { select: { name: true, email: true } } }
  })

  const totalMeds = medications.length
  const takenMeds = medications.filter(m => m.logs.some(l => l.status === "TAKEN")).length
  const healthCheckDone = todayMeasurements.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 flex flex-col items-center pb-8">
      {/* Premium Header */}
      <div className="w-full max-w-md p-8 bg-white shadow-xl shadow-blue-900/5 rounded-b-[2.5rem] border-b-4 border-blue-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Hello, {session.user.name?.split(" ")[0]}!</h1>
          <LogoutButton />
        </div>
        <p className="text-2xl text-gray-700 font-medium leading-snug">Here is your daily care schedule.</p>
      </div>

      <div className="w-full max-w-md px-6 space-y-5 flex-1">
        
        <PendingConnections requests={pendingRequests} />

        {/* Health Check - Massive Action Button */}
        <a href="/elder/checkin" className={`block w-full rounded-[2.5rem] p-8 text-left transition-all transform active:scale-95 shadow-lg border-4 flex items-center justify-between ${
          healthCheckDone 
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-green-900/10' 
            : 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700 shadow-blue-900/20 text-white hover:from-blue-600 hover:to-blue-700'
        }`}>
          <div>
            <h2 className={`text-3xl font-black ${healthCheckDone ? 'text-green-800' : 'text-white'}`}>Health Check</h2>
            <p className={`text-xl font-bold mt-2 ${healthCheckDone ? 'text-green-700' : 'text-blue-100'}`}>
              {healthCheckDone ? '✅ Completed today' : 'Tap here to record vitals'}
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner text-3xl ${healthCheckDone ? 'bg-white' : 'bg-blue-800/50'}`}>
            ❤️
          </div>
        </a>

        {/* Medicines */}
        <a href="/elder/medications" className="block w-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-950 rounded-[2.5rem] p-8 text-left shadow-lg shadow-emerald-900/5 transition-all transform active:scale-95 flex items-center justify-between border-4 border-emerald-200">
          <div>
            <h2 className="text-3xl font-black">Medicines</h2>
            <p className="text-xl font-bold opacity-80 mt-2">
              {totalMeds > 0 ? `${takenMeds} out of ${totalMeds} taken` : 'No medicines today'}
            </p>
          </div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-3xl">
            💊
          </div>
        </a>

        {/* Tasks */}
        <a href="/elder/tasks" className="block w-full bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-950 rounded-[2.5rem] p-8 text-left shadow-lg shadow-purple-900/5 transition-all transform active:scale-95 flex items-center justify-between border-4 border-purple-200">
          <div>
            <h2 className="text-3xl font-black">Daily Tasks</h2>
            <p className="text-xl font-bold opacity-80 mt-2">Check your family messages</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-3xl">
            📝
          </div>
        </a>

        {/* Games */}
        <a href="/elder/games" className="block w-full bg-gradient-to-br from-yellow-100 to-amber-100 text-amber-950 rounded-[2.5rem] p-8 text-left shadow-lg shadow-yellow-900/5 transition-all transform active:scale-95 flex items-center justify-between border-4 border-yellow-300">
          <div>
            <h2 className="text-3xl font-black">Brain Games</h2>
            <p className="text-xl font-bold opacity-80 mt-2">Keep your mind sharp</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-3xl">
            🧠
          </div>
        </a>

        <div className="pt-4">
          <TestAlarmButton />
        </div>

      </div>

      {/* Massive SOS Button */}
      <div className="w-full max-w-md px-6 mt-8">
        <a href="/elder/sos" className="block w-full bg-gradient-to-b from-red-500 to-red-700 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-red-900/40 transition-all transform active:scale-95 text-center border-4 border-red-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-400 opacity-20 animate-pulse"></div>
          <h2 className="font-black text-4xl relative z-10 tracking-widest text-shadow-sm">🚨 SOS 🚨</h2>
          <p className="text-xl font-bold text-red-100 mt-2 relative z-10">Emergency Help</p>
        </a>
      </div>
    </div>
  )
}
