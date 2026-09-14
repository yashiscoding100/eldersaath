import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { BillingBlockerClient } from "./BillingBlockerClient"

export async function BillingBlocker() {
  const session = await auth()
  
  // Do not block unauthenticated users (they can't login otherwise) or ADMINs.
  if (!session || session.user.role === "ADMIN") return null

  // Fetch the latest status directly from the DB on every page load
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isBlocked: true, blockMessage: true }
  })

  if (user?.isBlocked) {
    return <BillingBlockerClient message={user.blockMessage || "Your subscription is overdue. Please make a payment to restore access."} />
  }

  return null
}
