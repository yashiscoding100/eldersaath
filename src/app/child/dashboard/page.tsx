import { LinkParentButton } from "./LinkParentButton"
import { LogoutButton } from "@/components/LogoutButton"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { GlobalNotice } from "@/components/GlobalNotice"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-zinc-100 p-4 md:p-8 font-sans selection:bg-blue-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Premium Glass Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-sm ring-1 ring-gray-900/5 transition-all">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Care Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Welcome back, {session.user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <LinkParentButton />
            <LogoutButton />
          </div>
        </header>

        <GlobalNotice />

        {relationships.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-xl p-16 text-center rounded-[2.5rem] shadow-sm ring-1 ring-gray-900/5">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">👨‍👩‍👧‍👦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">No family members linked</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Connect with your elderly parents to monitor their real-time health data, medications, and tasks securely.</p>
            <LinkParentButton variant="large" />
          </div>
        ) : (
          <div className="grid gap-8">
            {elderData.map(({ relationship: rel, bp, sugar, spo2, pulse, totalMeds, takenMeds, healthCheckDone }) => (
              <div key={rel.id} className="bg-white/70 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 ring-1 ring-gray-900/5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
                
                {/* Profile Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-500/20">
                      {rel.elder.name?.charAt(0) || "E"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{rel.elder.name}</h2>
                      <p className="text-gray-500 font-medium">{rel.elder.email}</p>
                    </div>
                  </div>
                  
                  {rel.status === "PENDING" ? (
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-orange-100 text-orange-700 ring-1 ring-orange-400/20 shadow-sm">
                      ⏳ Pending Approval
                    </span>
                  ) : (
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ring-1 shadow-sm ${
                      healthCheckDone ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}>
                      {healthCheckDone ? '✓ Check-in Complete' : '⚠️ Pending Check-in'}
                    </span>
                  )}
                </div>

                {rel.status === "PENDING" ? (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 p-8 rounded-3xl text-center ring-1 ring-orange-900/5">
                    <div className="text-4xl mb-4">📨</div>
                    <p className="text-orange-900 font-extrabold text-xl mb-2 tracking-tight">Request Sent Successfully</p>
                    <p className="text-orange-700 font-medium">Waiting for {rel.elder.name} to approve your secure connection request from their dashboard.</p>
                  </div>
                ) : (
                  <>
                    {/* Health Stats Grid - Apple Health Style */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white p-5 rounded-3xl shadow-sm ring-1 ring-gray-900/5 flex flex-col justify-between group hover:ring-red-500/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-semibold text-gray-500">Blood Pressure</p>
                          <span className="text-red-500 text-lg">❤️</span>
                        </div>
                        <p className="font-extrabold text-gray-900 text-3xl tracking-tight">{bp}</p>
                      </div>

                      <div className="bg-white p-5 rounded-3xl shadow-sm ring-1 ring-gray-900/5 flex flex-col justify-between group hover:ring-blue-500/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-semibold text-gray-500">Blood Sugar</p>
                          <span className="text-blue-500 text-lg">🩸</span>
                        </div>
                        <p className="font-extrabold text-gray-900 text-3xl tracking-tight">{sugar}</p>
                      </div>

                      <div className="bg-white p-5 rounded-3xl shadow-sm ring-1 ring-gray-900/5 flex flex-col justify-between group hover:ring-cyan-500/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-semibold text-gray-500">Oxygen (SpO2)</p>
                          <span className="text-cyan-500 text-lg">💨</span>
                        </div>
                        <p className="font-extrabold text-gray-900 text-3xl tracking-tight">
                          {spo2}{spo2 !== "—" ? <span className="text-lg text-gray-400 font-medium ml-1">%</span> : ""}
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-3xl shadow-sm ring-1 ring-gray-900/5 flex flex-col justify-between group hover:ring-rose-500/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-semibold text-gray-500">Heart Rate</p>
                          <span className="text-rose-500 text-lg">💓</span>
                        </div>
                        <p className="font-extrabold text-gray-900 text-3xl tracking-tight">
                          {pulse}{pulse !== "—" ? <span className="text-lg text-gray-400 font-medium ml-1">bpm</span> : ""}
                        </p>
                      </div>
                    </div>

                    {/* Medicines & Deep Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-3xl ring-1 ring-emerald-900/5 flex flex-col justify-center">
                        <p className="text-sm font-semibold text-emerald-700 mb-1">Medication Status</p>
                        <p className="font-extrabold text-emerald-950 text-2xl tracking-tight">{takenMeds} <span className="text-lg font-medium text-emerald-700">/ {totalMeds} taken</span></p>
                      </div>
                      
                      <a href="/child/health" className="bg-white p-5 rounded-3xl ring-1 ring-gray-900/5 hover:ring-gray-900/10 hover:shadow-md transition-all group flex flex-col justify-between">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">📈</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Health History</p>
                          <p className="text-xs font-medium text-blue-600 mt-1">View Analytics →</p>
                        </div>
                      </a>
                      
                      <a href="/child/medications" className="bg-white p-5 rounded-3xl ring-1 ring-gray-900/5 hover:ring-gray-900/10 hover:shadow-md transition-all group flex flex-col justify-between">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">💊</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Medications</p>
                          <p className="text-xs font-medium text-blue-600 mt-1">Manage Regimen →</p>
                        </div>
                      </a>

                      <a href="/child/tasks" className="bg-white p-5 rounded-3xl ring-1 ring-gray-900/5 hover:ring-gray-900/10 hover:shadow-md transition-all group flex flex-col justify-between">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">📋</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Care Tasks</p>
                          <p className="text-xs font-medium text-blue-600 mt-1">Assign Tasks →</p>
                        </div>
                      </a>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Global Quick Actions Bar */}
        {relationships.length > 0 && (
          <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-sm ring-1 ring-gray-900/5 mt-8">
            <h3 className="font-extrabold text-gray-900 mb-6 tracking-tight text-lg">Care Network Management</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { href: "/child/health", icon: "❤️", label: "Health Hub" },
                { href: "/child/medications", icon: "💊", label: "Pharmacy" },
                { href: "/child/tasks", icon: "📋", label: "Task List" },
                { href: "/child/documents", icon: "📂", label: "Medical Vault" },
                { href: "/child/care-network", icon: "🏥", label: "Care Team" }
              ].map((item) => (
                <a key={item.label} href={item.href} className="flex flex-col items-center justify-center p-5 bg-white rounded-3xl ring-1 ring-gray-900/5 hover:ring-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <p className="font-semibold text-gray-700 text-sm">{item.label}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
