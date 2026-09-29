import re
import os

files = [
    'src/app/elder/documents/page.tsx',
    'src/app/elder/health/page.tsx',
    'src/app/elder/reports/page.tsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add imports if missing
    if 'import Link from "next/link"' not in content:
        content = content.replace('import { redirect } from "next/navigation"', 'import { redirect } from "next/navigation"\nimport Link from "next/link"\nimport { ArrowLeft } from "lucide-react"')
    
    # 2. Add back arrow to the header
    # Find the header block
    # Documents:
    # <header className="flex justify-between items-center mb-6">
    #     <div>
    #       <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical Vault</h1>
    
    header_pattern = r'(<header className="[^"]+">\s*)<div>(\s*<h1 className="[^"]+">.*?</h1>)'
    replacement = r'\1<div className="flex items-center gap-4">\n          <Link href="/elder/home" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">\n            <ArrowLeft className="w-6 h-6 text-slate-700" />\n          </Link>\n          <div>\2'
    
    content = re.sub(header_pattern, replacement, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

