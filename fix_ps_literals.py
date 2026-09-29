import re

with open('src/app/child/documents/DocumentRow.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('if (!confirm(Are you sure you want to delete ""?)) return', 'if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return')
content = content.replace('const res = await fetch(/api/documents?id=, { method: "DELETE" })', 'const res = await fetch(`/api/documents?id=${doc.id}`, { method: "DELETE" })')

with open('src/app/child/documents/DocumentRow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
