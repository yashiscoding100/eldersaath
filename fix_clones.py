import re
with open('src/app/elder/documents/page.tsx', 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('import { UploadDocumentForm } from "./UploadDocumentForm"', 'import { UploadDocumentForm } from "@/app/child/documents/UploadDocumentForm"')
content = content.replace('import { DocumentRow } from "./DocumentRow"', 'import { DocumentRow } from "@/app/child/documents/DocumentRow"')
content = content.replace('''  const relationship = await getActiveElder(session.user.id)

  if (!relationship) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center">
        <p className="text-gray-500">Please link an elder account first.</p>
      </div>
    )
  }''', '')
content = content.replace('relationship.elderId', 'session.user.id')
content = content.replace('relationship.elder.name || "Elder"', 'session.user.name || "Elder"')
with open('src/app/elder/documents/page.tsx', 'w', encoding='utf-8') as f: f.write(content)

with open('src/app/elder/health/page.tsx', 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('relationship.elderId', 'session.user.id')
content = content.replace('relationship.elder.name', 'session.user.name')
with open('src/app/elder/health/page.tsx', 'w', encoding='utf-8') as f: f.write(content)

with open('src/app/elder/reports/page.tsx', 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('relationship.elderId', 'session.user.id')
content = content.replace('relationship.elder.name', 'session.user.name')
with open('src/app/elder/reports/page.tsx', 'w', encoding='utf-8') as f: f.write(content)
