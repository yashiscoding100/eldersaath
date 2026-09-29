import os

with open('src/app/elder/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add formatter function
formatter = '''
  const formatFreq = (f: string) => {
    if (!f || f.toUpperCase() === "DAILY" || f === "0,1,2,3,4,5,6") return "Every Day";
    if (f.toUpperCase() === "WEEKLY") return "Weekly";
    if (f.toUpperCase() === "MONTHLY") return "Monthly";
    if (f.toUpperCase() === "ONCE") return "Once";
    const map: any = { "0": "Sun", "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat" };
    return f.split(",").map(d => map[d.trim()]).filter(Boolean).join(", ");
  }
'''

content = content.replace('return (', formatter + '\n  return (', 1)

# Render it right after the time span
render_html = '''
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-sm">
                          {(task as any).time}
                        </span>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">
                          {formatFreq(task.frequency)}
                        </span>
                        {(task as any).triggerAlarm && <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md"><Bell className="w-3 h-3" /> ALARM</span>}
                      </div>
'''

old_html = '''
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-sm">
                          {(task as any).time}
                        </span>
                        {(task as any).triggerAlarm && <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md"><Bell className="w-3 h-3" /> ALARM</span>}
                      </div>
'''

content = content.replace(old_html.strip(), render_html.strip())

with open('src/app/elder/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

