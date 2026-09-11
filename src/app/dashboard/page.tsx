import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role === "ELDER") {
    redirect("/elder/home")
  } else if (session.user.role === "CHILD") {
    redirect("/child/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  )
}
