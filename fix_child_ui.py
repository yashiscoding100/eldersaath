import re

with open('src/app/child/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Bell icon import if needed
if 'import { Bell }' not in content:
    content = content.replace('import { CheckCircle } from "lucide-react"', 'import { CheckCircle, Bell } from "lucide-react"')
    content = content.replace('import { redirect } from "next/navigation"', 'import { redirect } from "next/navigation"\nimport { Bell } from "lucide-react"')

# Add Time header
content = content.replace(
    '<th className="p-4 px-6">Frequency</th>',
    '<th className="p-4 px-6">Time</th>\n                  <th className="p-4 px-6">Frequency</th>'
)

# Add Time data cell
time_cell = '''
                      <td className="p-4 px-6">
                        {task.time ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-purple-600">{task.time}</span>
                            {task.triggerAlarm && <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded"><Bell className="w-3 h-3" /> ALARM</span>}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
'''

content = content.replace(
    '<td className="p-4 px-6 text-slate-500 uppercase tracking-wider text-xs font-semibold">{task.frequency}</td>',
    time_cell + '                      <td className="p-4 px-6 text-slate-500 uppercase tracking-wider text-xs font-semibold">{task.frequency}</td>'
)

with open('src/app/child/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
