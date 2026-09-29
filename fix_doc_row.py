import re

with open('src/app/child/documents/DocumentRow.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Make the buttons visible on mobile (remove opacity-0 and group-hover)
content = content.replace('inline-block opacity-0 group-hover:opacity-100', 'inline-block')
content = content.replace('disabled:opacity-50 opacity-0 group-hover:opacity-100', 'disabled:opacity-50')

# 2. Add an onClick handler to the entire row to view the document
# Wait, if we add onClick to the tr, we need to handle window.open
content = content.replace('<tr className="hover:bg-slate-50 transition group">', 
                          '<tr className="hover:bg-slate-50 transition cursor-pointer" onClick={() => window.open(doc.fileUrl, "_blank")}>')

# 3. Stop propagation on the Delete button so it doesn't open the document when trying to delete
content = content.replace('const handleDelete = async () => {', 
                          'const handleDelete = async (e: React.MouseEvent) => {\n    e.stopPropagation();')

# 4. Change the View button to target="_blank" and remove download (so it opens instead of downloading, which fails on base64)
old_anchor = r'<a\s+href=\{doc\.fileUrl\}\s+download=\{.*?\}\s+className=".*?"\s*>\s*View\s*</a>'
new_anchor = '<a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition inline-block">View</a>'

content = re.sub(old_anchor, new_anchor, content, flags=re.DOTALL)

with open('src/app/child/documents/DocumentRow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
