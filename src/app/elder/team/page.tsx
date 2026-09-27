import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ElderTeamPage() {
  const session = await auth()
  
  if (!session || session.user.role !== "ELDER") {
    redirect("/login")
  }

  const providers = await prisma.careProvider.findMany({
    where: { elderId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-white shadow-sm border border-slate-200 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
          <Link href="/elder/home" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Helpers</h1>
            <p className="text-sm text-slate-500">Call anyone working at your house.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        {providers.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-medium">No helpers added yet.</p>
          </div>
        ) : (
          providers.map(provider => (
            <div key={provider.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900">{provider.name}</h3>
                <p className="font-medium text-slate-500">{provider.role}</p>
              </div>
              {provider.phone && (
                <a 
                  href={`tel:${provider.phone}`}
                  className="w-14 h-14 bg-green-50 hover:bg-green-100 rounded-full flex items-center justify-center text-green-600 transition-colors shadow-sm"
                >
                  <Phone className="w-6 h-6" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
