import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { MarkTakenButton } from "./MarkTakenButton"

export default async function ElderMedications() {
  const session = await auth()

  if (!session || session.user.role !== "ELDER") {
    redirect("/login")
  }

  const medications = await prisma.medication.findMany({
    where: { elderId: session.user.id },
    orderBy: { time: 'asc' },
    include: {
      logs: {
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }
    }
  })

  const takenToday = medications.filter(m => m.logs.some(l => l.status === "TAKEN")).length
  const total = medications.length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Today's Medicines</h1>
        {total > 0 && (
          <p className="text-lg text-gray-500 mt-2">{takenToday}/{total} completed</p>
        )}
      </div>

      <div className="w-full max-w-md space-y-4 flex-1">
        {medications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
             <p className="text-xl text-gray-600">No medicines scheduled.</p>
             <p className="text-gray-400 mt-2">Your family member can add medicines from their dashboard.</p>
          </div>
        ) : (
          medications.map(med => {
            const isTaken = med.logs.some(l => l.status === "TAKEN")
            return (
              <div key={med.id} className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between ${isTaken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-sm mb-2">
                    {med.time}
                  </span>
                  <h2 className={`text-2xl font-bold ${isTaken ? 'text-green-800 line-through' : 'text-gray-900'}`}>{med.name}</h2>
                  <p className="text-lg text-gray-600">{med.dosage}</p>
                  {med.instructions && (
                    <p className="text-sm text-gray-500 mt-1">{med.instructions}</p>
                  )}
                </div>
                {isTaken ? (
                  <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-3xl text-green-600">✓</div>
                ) : (
                  <MarkTakenButton medicationId={med.id} />
                )}
              </div>
            )
          })
        )}
      </div>
      
      <div className="w-full max-w-md pt-6">
        <a href="/elder/home" className="block w-full py-4 text-center bg-gray-200 text-gray-800 font-bold rounded-2xl text-xl hover:bg-gray-300 transition-colors">
          Back Home
        </a>
      </div>
    </div>
  )
}
