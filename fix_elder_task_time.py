import re

with open('src/app/elder/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific time-only block with a robust block that always shows frequency
bad_html = '''                    {(task as any).time && (
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-sm">
                          {(task as any).time}
                        </span>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">
                          {formatFreq(task.frequency)}
                        </span>
                        {(task as any).triggerAlarm && <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md"><Bell className="w-3 h-3" /> ALARM</span>}
                      </div>
                    )}'''

good_html = '''                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {(task as any).time && (
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-sm">
                          {(task as any).time}
                        </span>
                      )}
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold text-sm">
                        {formatFreq(task.frequency)}
                      </span>
                      {(task as any).triggerAlarm && <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md"><Bell className="w-3 h-3" /> ALARM</span>}
                    </div>'''

content = content.replace(bad_html, good_html)

with open('src/app/elder/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
