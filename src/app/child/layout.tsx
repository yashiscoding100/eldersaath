import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ChildLayoutShell } from "@/components/child/ChildLayoutShell"

export default async function ChildLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  const relationships = await prisma.caregiverRelationship.findMany({
    where: { childId: session.user.id, status: "ACTIVE" },
    include: { elder: true }
  })
  
  const elderName = relationships.length > 0 ? relationships[0].elder.name || "Elder" : "No Elder Connected"

  return (
    <ChildLayoutShell elderName={elderName}>
      {children}
    </ChildLayoutShell>
  )
}
