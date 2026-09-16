import { AddMedicineForm } from "./AddMedicineForm"
import { MedicineRow } from "./MedicineRow"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ChildMedications() {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  // Get the first linked elder
  const relationship = await prisma.caregiverRelationship.findFirst({
    where: { childId: session.user.id, status: "ACTIVE" },
    include: { elder: true },
  })

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500 font-bold">Please link an elder account first.</p>
      </div>
    )
  }

  const medications = await prisma.medication.findMany({
    where: { elderId: relationship.elderId },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medicines for {relationship.elder.name}</h1>
          </div>
          <div className="flex gap-4 items-center">
             <AddMedicineForm elderId={relationship.elderId} />
             <a href="/child/dashboard" className="text-blue-600 font-bold hover:underline">← Back</a>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {medications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 font-medium">No medicines added yet.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-bold text-gray-700">Name</th>
                  <th className="p-4 font-bold text-gray-700">Dosage</th>
                  <th className="p-4 font-bold text-gray-700">Time</th>
                  <th className="p-4 font-bold text-gray-700">Frequency</th>
                  <th className="p-4 font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medications.map(med => (
                  <MedicineRow key={med.id} med={med} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
