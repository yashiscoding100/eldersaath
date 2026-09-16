import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ChildSettings() {
  const session = await auth()
  
  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your profile and notification preferences.</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Profile Information</h4>
            <p className="text-sm text-slate-500 mt-1">Update your name and email address.</p>
          </div>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700 text-sm hover:bg-slate-100 transition">
            Edit Profile
          </button>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Push Notifications</h4>
            <p className="text-sm text-slate-500 mt-1">Receive alerts for SOS and medication reminders.</p>
          </div>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700 text-sm hover:bg-slate-100 transition">
            Configure
          </button>
        </div>
      </div>
    </div>
  )
}
