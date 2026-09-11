import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function CareNetwork() {
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

  const providers = await prisma.careProvider.findMany({
    where: { elderId: relationship.elderId },
    orderBy: { createdAt: 'desc' }
  })

  async function addProvider(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string

    if (!name || !role) return

    await prisma.careProvider.create({
      data: {
        elderId: relationship!.elderId,
        name,
        role,
        phone,
        email
      }
    })
    redirect("/child/care-network")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Care Network</h1>
            <p className="text-gray-600 font-medium">Manage contacts for {relationship.elder.name}</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Provider</h2>
            <form action={addProvider} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Name</label>
                <input required type="text" name="name" className="text-gray-900 font-bold w-full border-2 border-gray-300 p-2 rounded-lg" placeholder="Dr. Smith" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Role</label>
                <select required name="role" className="text-gray-900 font-bold w-full border-2 border-gray-300 p-2 rounded-lg font-medium">
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="PHYSIO">Physiotherapist</option>
                  <option value="CARETAKER">Daily Caretaker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Phone (Optional)</label>
                <input type="tel" name="phone" className="text-gray-900 font-bold w-full border-2 border-gray-300 p-2 rounded-lg" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Email (Optional)</label>
                <input type="email" name="email" className="text-gray-900 font-bold w-full border-2 border-gray-300 p-2 rounded-lg" placeholder="doc@clinic.com" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                Add Contact
              </button>
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            {providers.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 font-medium">No care providers added yet.</p>
              </div>
            ) : (
              providers.map(provider => (
                <div key={provider.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl">
                      {provider.role === "DOCTOR" ? "🩺" : provider.role === "NURSE" ? "💉" : "🧑‍⚕️"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">{provider.name}</h3>
                      <p className="text-blue-600 font-bold text-sm tracking-wide uppercase">{provider.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {provider.phone && <p className="text-gray-700 font-bold">{provider.phone}</p>}
                    {provider.email && <p className="text-gray-500 text-sm font-medium">{provider.email}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
