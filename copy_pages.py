import os

os.makedirs('src/app/elder/health', exist_ok=True)
os.makedirs('src/app/elder/reports', exist_ok=True)
os.makedirs('src/app/elder/documents', exist_ok=True)

# --- 1. HEALTH PAGE ---
with open('src/app/child/health/page.tsx', 'r', encoding='utf-8') as f:
    health_ui = f.read()
health_ui = health_ui.replace('export default async function ChildHealthHistory() {', 'export default async function ElderHealthHistory() {')
health_ui = health_ui.replace('import { getActiveElder } from "@/lib/activeElder"\n', '')
health_ui = health_ui.replace('if (!session || session.user.role !== "CHILD") {\n    redirect("/login")\n  }', 'if (!session || session.user.role !== "ELDER") {\n    redirect("/login")\n  }')
health_ui = health_ui.replace(
'''const relationship = await getActiveElder(session.user.id)

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500 font-bold">Please link an elder account first.</p>
      </div>
    )
  }

  const measurements = await prisma.healthMeasurement.findMany({
    where: { elderId: relationship.elderId },
    orderBy: { timestamp: 'desc' },
  })''',
'''const measurements = await prisma.healthMeasurement.findMany({
    where: { elderId: session.user.id },
    orderBy: { timestamp: 'desc' },
  })'''
)
health_ui = health_ui.replace('relationship.elderId', 'session.user.id')
health_ui = health_ui.replace('relationship.elder.name || "Elder"', 'session.user.name || "Elder"')
health_ui = health_ui.replace('import { AddVitalsModal } from "./AddVitalsModal"', 'import { AddVitalsModal } from "@/app/child/health/AddVitalsModal"')
health_ui = health_ui.replace('href="/child/dashboard"', 'href="/elder/home"')
with open('src/app/elder/health/page.tsx', 'w', encoding='utf-8') as f: f.write(health_ui)

# --- 2. REPORTS PAGE ---
with open('src/app/child/reports/page.tsx', 'r', encoding='utf-8') as f:
    reports_ui = f.read()
reports_ui = reports_ui.replace('export default async function ChildReports', 'export default async function ElderReports')
reports_ui = reports_ui.replace('import { getActiveElder } from "@/lib/activeElder"\n', '')
reports_ui = reports_ui.replace('import { PrintButton } from "./PrintButton"', 'import { PrintButton } from "@/app/child/reports/PrintButton"')
reports_ui = reports_ui.replace('if (!session || session.user.role !== "CHILD") {\n    redirect("/login")\n  }', 'if (!session || session.user.role !== "ELDER") {\n    redirect("/login")\n  }')
reports_ui = reports_ui.replace(
'''// Get the first linked elder
  const relationship = await getActiveElder(session.user.id)

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500 font-bold">Please link an elder account first to view reports.</p>
      </div>
    )
  }''',
''
)
reports_ui = reports_ui.replace('relationship.elderId', 'session.user.id')
reports_ui = reports_ui.replace('relationship.elder.name || "Elder"', 'session.user.name || "Elder"')
reports_ui = reports_ui.replace('href="/child/dashboard"', 'href="/elder/home"')
with open('src/app/elder/reports/page.tsx', 'w', encoding='utf-8') as f: f.write(reports_ui)

# --- 3. DOCUMENTS PAGE ---
with open('src/app/child/documents/page.tsx', 'r', encoding='utf-8') as f:
    docs_ui = f.read()
docs_ui = docs_ui.replace('export default async function ChildDocuments() {', 'export default async function ElderDocuments() {')
docs_ui = docs_ui.replace('import { getActiveElder } from "@/lib/activeElder"\n', '')
docs_ui = docs_ui.replace('import { DocumentList } from "./DocumentList"\nimport { UploadModal } from "./UploadModal"', 'import { DocumentList } from "@/app/child/documents/DocumentList"\nimport { UploadModal } from "@/app/child/documents/UploadModal"')
docs_ui = docs_ui.replace('if (!session || session.user.role !== "CHILD") {\n    redirect("/login")\n  }', 'if (!session || session.user.role !== "ELDER") {\n    redirect("/login")\n  }')
docs_ui = docs_ui.replace(
'''// Get active elder
  const relationship = await getActiveElder(session.user.id)

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500 font-bold">Please link an elder account first.</p>
      </div>
    )
  }''',
''
)
docs_ui = docs_ui.replace('relationship.elderId', 'session.user.id')
docs_ui = docs_ui.replace('href="/child/dashboard"', 'href="/elder/home"')
with open('src/app/elder/documents/page.tsx', 'w', encoding='utf-8') as f: f.write(docs_ui)

