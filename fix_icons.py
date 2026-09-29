import re

with open('src/app/child/documents/DocumentRow.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { FileText, Image as ImageIcon } from "lucide-react"' not in content:
    content = content.replace('import { useRouter } from "next/navigation"', 'import { useRouter } from "next/navigation"\nimport { FileText, Image as ImageIcon } from "lucide-react"')

# Replace the broken emoji characters with Lucide icons
content = re.sub(r'\{doc.fileType.includes\("pdf"\) \? ".*?" : ".*?"\}', '{doc.fileType.includes("pdf") ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}', content)

with open('src/app/child/documents/DocumentRow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
