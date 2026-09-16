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
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Care Network</h1>
          <p className="text-sm text-slate-500 mt-1">Manage contacts and care providers for {relationship.elder.name}</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Add Provider</h2>
          <form action={addProvider} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
              <input required type="text" name="name" className="text-slate-900 font-bold w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-2.5 rounded-lg" placeholder="Dr. Smith" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
              <select required name="role" className="text-slate-900 font-bold w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-2.5 rounded-lg">
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
                <option value="PHYSIO">Physiotherapist</option>
                <option value="CARETAKER">Daily Caretaker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone (Optional)</label>
              <input type="tel" name="phone" className="text-slate-900 font-bold w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-2.5 rounded-lg" placeholder="+1 234 567 8900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email (Optional)</label>
              <input type="email" name="email" className="text-slate-900 font-bold w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-2.5 rounded-lg" placeholder="doc@clinic.com" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 mt-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
              Add Contact
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {providers.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">No care providers</h3>
              <p className="text-slate-500 text-sm mt-1">Add doctors and nurses to keep track of the care team.</p>
            </div>
          ) : (
            providers.map(provider => (
              <div key={provider.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between group hover:border-blue-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center text-xl border border-slate-100">
                    {provider.role === "DOCTOR" ? "👨‍⚕️" : provider.role === "NURSE" ? "👩‍⚕️" : "🧑‍🤝‍🧑"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{provider.name}</h3>
                    <p className="text-blue-600 font-bold text-[10px] tracking-wider uppercase">{provider.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  {provider.phone && <p className="text-slate-700 font-semibold text-sm">{provider.phone}</p>}
                  {provider.email && <p className="text-slate-500 text-xs font-medium">{provider.email}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
