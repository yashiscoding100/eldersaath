import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ChildReports() {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Health Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and export automated health analytics.</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
          <span className="text-2xl text-blue-500">📊</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Reports Coming Soon</h3>
        <p className="text-slate-500 text-sm max-w-sm">
          We're building a feature to generate comprehensive weekly and monthly PDF reports of health trends, medication adherence, and AI insights.
        </p>
      </div>
    </div>
  )
}
