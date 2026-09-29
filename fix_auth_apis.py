import os

# --- 1. Modify APIs to allow ELDER ---
# Health API
with open('src/app/api/child/health/route.ts', 'r', encoding='utf-8') as f:
    health_api = f.read()

health_api = health_api.replace(
    'if (!session || session.user.role !== "CHILD") {\n    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })\n  }',
    '''if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }'''
)
health_api = health_api.replace(
    '''const rel = await prisma.caregiverRelationship.findFirst({
      where: { childId: session.user.id, elderId, status: "ACTIVE" }
    })
    
    if (!rel) {
      return NextResponse.json({ message: "Not linked to this elder" }, { status: 403 })
    }''',
    '''if (session.user.role === "CHILD") {
      const rel = await prisma.caregiverRelationship.findFirst({
        where: { childId: session.user.id, elderId, status: "ACTIVE" }
      })
      if (!rel) return NextResponse.json({ message: "Not linked to this elder" }, { status: 403 })
    } else if (session.user.role === "ELDER" && session.user.id !== elderId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }'''
)
with open('src/app/api/child/health/route.ts', 'w', encoding='utf-8') as f: f.write(health_api)

# Document API
with open('src/app/api/documents/route.ts', 'r', encoding='utf-8') as f:
    doc_api = f.read()

doc_api = doc_api.replace(
    'if (!session || session.user.role !== "CHILD") {\n    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })\n  }',
    'if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })'
)
doc_api = doc_api.replace(
    '''const relationship = await prisma.caregiverRelationship.findUnique({
      where: {
        elderId_childId: { elderId, childId: session.user.id }
      }
    })

    if (!relationship || relationship.status !== "ACTIVE") {
       return NextResponse.json({ message: "Unauthorized for this elder" }, { status: 403 })
    }''',
    '''if (session.user.role === "CHILD") {
      const relationship = await prisma.caregiverRelationship.findUnique({
        where: { elderId_childId: { elderId, childId: session.user.id } }
      })
      if (!relationship || relationship.status !== "ACTIVE") return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    } else if (session.user.role === "ELDER" && session.user.id !== elderId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }'''
)
doc_api = doc_api.replace(
    '''const relationship = await prisma.caregiverRelationship.findUnique({
      where: {
        elderId_childId: { elderId: document.elderId, childId: session.user.id }
      }
    })

    if (!relationship || relationship.status !== "ACTIVE") {
       return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }''',
    '''if (session.user.role === "CHILD") {
      const relationship = await prisma.caregiverRelationship.findUnique({
        where: { elderId_childId: { elderId: document.elderId, childId: session.user.id } }
      })
      if (!relationship || relationship.status !== "ACTIVE") return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    } else if (session.user.role === "ELDER" && session.user.id !== document.elderId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }'''
)
with open('src/app/api/documents/route.ts', 'w', encoding='utf-8') as f: f.write(doc_api)
