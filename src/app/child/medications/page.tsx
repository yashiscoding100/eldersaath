import { AddMedicineForm } from "./AddMedicineForm"
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
    where: { childId: session.user.id },
    include: { elder: true },
  })

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500">Please link an elder account first.</p>
      </div>
    )
  }

  const medications = await prisma.medication.findMany({
    where: { elderId: relationship.elderId },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Medicines for {relationship.elder.name}</h1>
          </div>
          <AddMedicineForm elderId={relationship.elderId} />
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {medications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No medicines added yet.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Name</th>
                  <th className="p-4 font-medium text-gray-600">Dosage</th>
                  <th className="p-4 font-medium text-gray-600">Time</th>
                  <th className="p-4 font-medium text-gray-600">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {medications.map(med => (
                  <tr key={med.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{med.name}</td>
                    <td className="p-4 text-gray-600">{med.dosage}</td>
                    <td className="p-4 text-gray-600">{med.time}</td>
                    <td className="p-4 text-gray-600">{med.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
