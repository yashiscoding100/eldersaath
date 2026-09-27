import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getActiveElder } from "@/lib/activeElder"
import { redirect } from "next/navigation"
import { Phone, UserPlus } from "lucide-react"
import { AddProviderForm } from "./AddProviderForm"

export default async function CareTeamPage() {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  const relationship = await getActiveElder(session.user.id)
  if (!relationship) redirect("/child/dashboard")

  const providers = await prisma.careProvider.findMany({
    where: { elderId: relationship.elderId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Care Team</h1>
          <p className="text-sm text-slate-500 mt-1">Household workers, doctors, and nurses.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <AddProviderForm elderId={relationship.elderId} />
      </div>

      <div className="space-y-4">
        {providers.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-medium">No team members added yet.</p>
          </div>
        ) : (
          providers.map(provider => (
            <div key={provider.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{provider.name}</h3>
                <p className="text-sm font-medium text-slate-500">{provider.role}</p>
              </div>
              {provider.phone && (
                <a 
                  href={`tel:${provider.phone}`}
                  className="w-12 h-12 bg-green-50 hover:bg-green-100 rounded-full flex items-center justify-center text-green-600 transition-colors shadow-sm"
                >
                  <Phone className="w-5 h-5" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
