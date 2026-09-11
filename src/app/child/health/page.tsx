import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ChildHealthHistory() {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  const relationship = await prisma.caregiverRelationship.findFirst({
    where: { childId: session.user.id },
    include: { elder: true },
  })

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500 font-bold">Please link an elder account first.</p>
      </div>
    )
  }

  const measurements = await prisma.healthMeasurement.findMany({
    where: { elderId: relationship.elderId },
    orderBy: { timestamp: 'desc' },
  })

  // Group by date
  const grouped = measurements.reduce((acc, curr) => {
    const date = curr.timestamp.toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(curr)
    return acc
  }, {} as Record<string, typeof measurements>)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health History Timeline</h1>
            <p className="text-gray-600 font-medium">Historical records for {relationship.elder.name}</p>
          </div>
          <a href="/child/dashboard" className="text-blue-600 font-bold hover:underline">← Back to Dashboard</a>
        </header>

        <div className="space-y-6">
          {Object.keys(grouped).length === 0 ? (
             <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
               <p className="text-gray-500 font-medium">No health measurements recorded yet.</p>
             </div>
          ) : (
            Object.entries(grouped).map(([date, records]) => (
              <div key={date} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">{date}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {records.map(record => (
                    <div key={record.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">{record.type}</p>
                        <p className="font-black text-gray-900 text-xl">{record.value} <span className="text-sm font-medium text-gray-500">{record.unit}</span></p>
                      </div>
                      <div className="text-xl">
                        {record.type === "BP" ? "❤️" : record.type === "SUGAR" ? "🩸" : record.type === "SPO2" ? "🫁" : record.type === "PULSE" ? "💓" : "⚕️"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
