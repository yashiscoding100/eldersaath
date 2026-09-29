import re
with open('src/app/elder/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace('import { ElderAddTaskForm } from "./ElderAddTaskForm"', 'import { ElderAddTaskForm } from "./ElderAddTaskForm"\nimport Link from "next/link"\nimport { ArrowLeft } from "lucide-react"')

# Add back arrow and fix titles
content = content.replace(
    '<div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm mb-6 text-center">',
    '<div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm mb-6 text-center relative">\n        <Link href="/elder/home" className="absolute left-4 top-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">\n          <ArrowLeft className="w-6 h-6 text-slate-700" />\n        </Link>'
)
content = content.replace('Your Wellbeing', 'Things to Do')
content = content.replace('Gentle reminders & care notes for you', 'Here are the things you need to do today.')

with open('src/app/elder/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
