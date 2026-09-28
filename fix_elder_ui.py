import re

with open('src/app/elder/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Bell icon import if needed
if 'import { Bell }' not in content:
    content = content.replace('import { CheckCircle } from "lucide-react"', 'import { CheckCircle, Bell } from "lucide-react"')

# Inject time badge and alarm icon above the title
time_badge = '''
                    {(task as any).time && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-sm">
                          {(task as any).time}
                        </span>
                        {(task as any).triggerAlarm && <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md"><Bell className="w-3 h-3" /> ALARM</span>}
                      </div>
                    )}
'''

content = content.replace(
    '<div>\n                  <h2',
    '<div>\n' + time_badge + '                  <h2'
)

with open('src/app/elder/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
