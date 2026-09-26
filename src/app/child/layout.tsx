import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ChildLayoutShell } from "@/components/child/ChildLayoutShell"
import { cookies } from "next/headers"

export default async function ChildLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user.role !== "CHILD") {
    redirect("/login")
  }

  const relationships = await prisma.caregiverRelationship.findMany({
    where: { childId: session.user.id, status: "ACTIVE" },
    include: { elder: true }
  })
  
  const cookieStore = await cookies()
  const storedElderId = cookieStore.get("activeElderId")?.value
  const activeRelationship = relationships.find(r => r.elderId === storedElderId) || relationships[0]
  const activeElderId = activeRelationship?.elderId || ""
  const elderName = activeRelationship ? (activeRelationship.elder.name || "Elder") : "No Elder Connected"
  
  const mappedElders = relationships.map(r => ({ id: r.elderId, name: r.elder.name || "Elder" }))

  const elderIds = relationships.map(rel => rel.elderId)
  
  const activeEmergencies = await prisma.emergencyEvent.count({
    where: {
      elderId: { in: elderIds },
      status: "ACTIVE"
    }
  })

  return (
    <ChildLayoutShell 
      elderName={elderName} 
      userName={session.user.name || "Family Member"}
      parentCount={relationships.length}
      hasEmergency={activeEmergencies > 0}
    >
      {children}
    </ChildLayoutShell>
  )
}
