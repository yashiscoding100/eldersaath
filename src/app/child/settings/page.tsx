import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { EditProfileForm } from "./EditProfileForm"
import { PushNotificationSettings } from "./PushNotificationSettings"

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
        <EditProfileForm 
          initialName={session.user.name || ""} 
          initialEmail={session.user.email || ""} 
        />
        <PushNotificationSettings />
      </div>
    </div>
  )
}
