import re

with open('src/app/api/elder/preferences/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''
export async function PATCH(req: Request) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    let targetElderId = session.user.id

    if (session.user.role === "CHILD") {
      targetElderId = body.elderId
      if (!targetElderId) return NextResponse.json({ message: "Missing elderId" }, { status: 400 })
      
      const relationship = await prisma.caregiverRelationship.findUnique({
        where: { elderId_childId: { elderId: targetElderId, childId: session.user.id } }
      })
      if (!relationship) return NextResponse.json({ message: "Unauthorized for this elder" }, { status: 403 })
    }

    // Prepare update data dynamically based on what was passed
    const updateData: any = {}
    if (body.requiredVitals !== undefined) updateData.requiredVitals = body.requiredVitals
    if (body.askSymptoms !== undefined) updateData.askSymptoms = body.askSymptoms
    if (body.stickyAlarmNotification !== undefined) updateData.stickyAlarmNotification = body.stickyAlarmNotification

    const updatedProfile = await prisma.elderProfile.upsert({
      where: { userId: targetElderId },
      update: updateData,
      create: {
        userId: targetElderId,
        requiredVitals: body.requiredVitals || "BP,SUGAR,SPO2,PULSE,TEMP,WEIGHT",
        askSymptoms: body.askSymptoms ?? true,
        stickyAlarmNotification: body.stickyAlarmNotification ?? true
      }
    })

    return NextResponse.json({ message: "Preferences updated", profile: updatedProfile })
'''

content = re.sub(r'export async function PATCH\(req: Request\) \{.*?return NextResponse\.json\(\{ \n      message: "Preferences updated successfully",\n      profile: updatedProfile\n    \}\)\n', replacement, content, flags=re.DOTALL)
with open('src/app/api/elder/preferences/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
