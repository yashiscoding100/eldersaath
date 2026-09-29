import re

with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('useState("DAILY")', 'useState("0,1,2,3,4,5,6")')
content = content.replace('setFrequency("DAILY")', 'setFrequency("0,1,2,3,4,5,6")')

day_selector_ui = '''
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Days of the Week</label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: "1", label: "Mon" },
                { val: "2", label: "Tue" },
                { val: "3", label: "Wed" },
                { val: "4", label: "Thu" },
                { val: "5", label: "Fri" },
                { val: "6", label: "Sat" },
                { val: "0", label: "Sun" },
              ].map(day => {
                const isSelected = frequency.includes(day.val);
                return (
                  <button
                    key={day.val}
                    type="button"
                    onClick={() => {
                      let arr = frequency ? frequency.split(',').filter(d => d) : [];
                      if (isSelected) arr = arr.filter(d => d !== day.val);
                      else arr.push(day.val);
                      setFrequency(arr.join(','));
                    }}
                    className={isSelected ? "px-3 py-1.5 rounded-full text-sm font-bold transition bg-blue-600 text-white shadow-sm" : "px-3 py-1.5 rounded-full text-sm font-bold transition bg-slate-100 text-slate-500 hover:bg-slate-200"}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
          </div>
'''

old_block_pattern = r'<div className="mb-4">\s*<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Frequency</label>\s*<select.*?</div>'
content = re.sub(old_block_pattern, day_selector_ui.strip(), content, flags=re.DOTALL)

with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
