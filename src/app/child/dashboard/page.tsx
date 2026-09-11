import { LinkParentButton } from "./LinkParentButton"
import { LogoutButton } from "@/components/LogoutButton"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ChildDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  const relationships = await prisma.caregiverRelationship.findMany({
    where: { childId: session.user.id },
    include: { elder: true },
  })

  // Get latest health data for each linked elder
  const elderData = await Promise.all(
    relationships.map(async (rel) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const latestMeasurements = await prisma.healthMeasurement.findMany({
        where: { elderId: rel.elderId, timestamp: { gte: today } },
        orderBy: { timestamp: 'desc' },
      })

      const medications = await prisma.medication.findMany({
        where: { elderId: rel.elderId },
        include: {
          logs: {
            where: { timestamp: { gte: today } }
          }
        }
      })

      const totalMeds = medications.length
      const takenMeds = medications.filter(m => m.logs.some(l => l.status === "TAKEN")).length

      const bp = latestMeasurements.find(m => m.type === "BP")
      const sugar = latestMeasurements.find(m => m.type === "SUGAR")
      const spo2 = latestMeasurements.find(m => m.type === "SPO2")
      const pulse = latestMeasurements.find(m => m.type === "PULSE")

      return {
        relationship: rel,
        bp: bp?.value || "—",
        sugar: sugar?.value || "—",
        spo2: spo2?.value || "—",
        pulse: pulse?.value || "—",
        totalMeds,
        takenMeds,
        healthCheckDone: latestMeasurements.length > 0,
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Family Dashboard</h1>
            <p className="text-gray-500">Welcome back, {session.user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <LinkParentButton />
            <LogoutButton />
          </div>
        </header>

        {relationships.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No linked parents yet</h2>
            <p className="text-gray-500 mb-6">Link your elderly parent's account to start monitoring their health.</p>
            <LinkParentButton variant="large" />
          </div>
        ) : (
          <div className="grid gap-6">
            {elderData.map(({ relationship: rel, bp, sugar, spo2, pulse, totalMeds, takenMeds, healthCheckDone }) => (
              <div key={rel.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{rel.elder.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    healthCheckDone ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {healthCheckDone ? 'Check-in Done' : 'Pending Check-in'}
                  </span>
                </div>

                {/* Health Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">BP</p>
                    <p className="font-bold text-gray-800 text-lg">{bp}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Sugar</p>
                    <p className="font-bold text-gray-800 text-lg">{sugar}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">SpO2</p>
                    <p className="font-bold text-gray-800 text-lg">{spo2}{spo2 !== "—" ? "%" : ""}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Pulse</p>
                    <p className="font-bold text-gray-800 text-lg">{pulse}{pulse !== "—" ? " BPM" : ""}</p>
                  </div>
                </div>

                {/* Medicines & Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Medicines</p>
                    <p className="font-bold text-gray-800">{takenMeds}/{totalMeds} taken</p>
                  </div>
                  <a href="/child/health" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition block">
                    <p className="text-sm text-blue-500">Health History</p>
                    <p className="font-bold text-blue-700">View →</p>
                  </a>
                  <a href="/child/medications" className="bg-emerald-50 p-4 rounded-lg hover:bg-emerald-100 transition block">
                    <p className="text-sm text-emerald-500">Medications</p>
                    <p className="font-bold text-emerald-700">Manage →</p>
                  </a>
                  <a href="/child/tasks" className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition block">
                    <p className="text-sm text-purple-500">Tasks</p>
                    <p className="font-bold text-purple-700">Manage →</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions Bar */}
        {relationships.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <a href="/child/health" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition">
                <div className="text-2xl mb-1">❤️</div>
                <p className="font-medium text-gray-700">Health</p>
              </a>
              <a href="/child/medications" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition">
                <div className="text-2xl mb-1">💊</div>
                <p className="font-medium text-gray-700">Medicines</p>
              </a>
              <a href="/child/tasks" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition">
                <div className="text-2xl mb-1">📝</div>
                <p className="font-medium text-gray-700">Tasks</p>
              </a>
              <a href="/child/documents" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition">
                <div className="text-2xl mb-1">📄</div>
                <p className="font-medium text-gray-700">Documents</p>
              </a>
              <a href="/child/care-network" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition">
                <div className="text-2xl mb-1">🏥</div>
                <p className="font-medium text-gray-700">Care Network</p>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
