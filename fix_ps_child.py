import re

with open('src/app/child/tasks/AddTaskForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_class = 'className={px-3 py-1.5 rounded-full text-xs font-bold transition }'
good_class = 'className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${isSelected ? "bg-purple-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}'

content = content.replace(bad_class, good_class)

with open('src/app/child/tasks/AddTaskForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
