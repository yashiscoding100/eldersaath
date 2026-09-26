import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getActiveElder } from "@/lib/activeElder"
import { PrintButton } from "./PrintButton"
import { format } from "date-fns"

export default async function ChildReports({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  // Get the first linked elder
  const relationship = await getActiveElder(session.user.id)

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500 font-bold">Please link an elder account first to view reports.</p>
      </div>
    )
  }

  const periodDays = searchParams.period === "7" ? 7 : 30

  // Fetch data based on period
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - periodDays)

  const measurements = await prisma.healthMeasurement.findMany({
    where: { elderId: relationship.elderId, timestamp: { gte: cutoffDate } },
    orderBy: { timestamp: 'desc' }
  })

  const meds = await prisma.medication.findMany({
    where: { elderId: relationship.elderId },
    include: {
      logs: {
        where: { timestamp: { gte: cutoffDate } }
      }
    }
  })

  // Calculations
  const symptomsList = measurements.filter(m => m.type === "SYMPTOMS")
  
  const totalMedsExpected = meds.length * periodDays // Rough estimate
  const medsTaken = meds.reduce((acc, med) => acc + med.logs.filter(l => l.status === "TAKEN").length, 0)
  const adherenceRate = totalMedsExpected > 0 ? Math.round((medsTaken / totalMedsExpected) * 100) : 0

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Health Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and export automated health analytics.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
            <a href="?period=7" className={`px-4 py-1.5 rounded-md transition ${periodDays === 7 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Weekly</a>
            <a href="?period=30" className={`px-4 py-1.5 rounded-md transition ${periodDays === 30 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Monthly</a>
          </div>
          <PrintButton />
        </div>
      </header>

      {/* Printable Report Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-slate-900">ElderSaath Health Report</h2>
              <p className="text-slate-600 font-medium mt-1">{periodDays}-Day Analytics Summary</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Patient</p>
              <p className="text-xl font-bold text-slate-900">{relationship.elder.name}</p>
              <p className="text-sm text-slate-500">{format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm font-bold text-slate-500 uppercase">Med Adherence</p>
            <p className="text-3xl font-black text-blue-600">{adherenceRate}%</p>
            <p className="text-xs text-slate-400 mt-1">Estimated 30-day rate</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm font-bold text-slate-500 uppercase">Check-ins Logged</p>
            <p className="text-3xl font-black text-emerald-600">{measurements.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total health data points</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm font-bold text-slate-500 uppercase">Symptoms Reported</p>
            <p className="text-3xl font-black text-amber-600">{symptomsList.length}</p>
            <p className="text-xs text-slate-400 mt-1">Symptom check-ins</p>
          </div>
        </div>

        {/* Detailed Logs */}
        <div className="space-y-8">
          
          {/* Recent Symptoms */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Reported Symptoms</h3>
            {symptomsList.length === 0 ? (
              <p className="text-slate-500 italic">No unusual symptoms reported in the last 30 days.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {symptomsList.slice(0, 10).map((s, i) => (
                  <li key={i} className="text-slate-700">
                    <span className="font-bold">{format(new Date(s.timestamp), 'MMM d')}:</span> {s.value}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Vitals Summary */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Latest Vitals Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['BP', 'SUGAR', 'SPO2', 'PULSE', 'WEIGHT'].map(type => {
                const latest = measurements.find(m => m.type === type)
                return latest ? (
                  <div key={type} className="p-3 bg-slate-50 rounded border border-slate-100">
                    <p className="text-xs font-bold text-slate-500">{type}</p>
                    <p className="text-lg font-bold text-slate-900">{latest.value} {latest.unit}</p>
                    <p className="text-xs text-slate-400">{format(new Date(latest.timestamp), 'MMM d, h:mm a')}</p>
                  </div>
                ) : null
              })}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-400 text-xs">
          <p>This report was generated automatically by ElderSaath.</p>
          <p>Please consult a healthcare professional for medical advice.</p>
        </div>

      </div>
    </div>
  )
}
