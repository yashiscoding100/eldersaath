import re

with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure frequency state exists
if 'const [frequency, setFrequency] = useState("0,1,2,3,4,5,6")' not in content:
    content = content.replace('const [triggerAlarm, setTriggerAlarm] = useState(false)', 'const [triggerAlarm, setTriggerAlarm] = useState(false)\n  const [frequency, setFrequency] = useState("0,1,2,3,4,5,6")')
    
# Make sure frequency is in the payload
if 'frequency' not in content.split('JSON.stringify({')[1].split('})')[0]:
    content = content.replace('triggerAlarm })', 'triggerAlarm, frequency })')

day_selector_ui = '''
        <div className="mb-2 text-left">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Days of the Week</label>
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
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
          {frequency.length === 0 && <p className="text-xs text-red-500 mt-1">Please select at least one day.</p>}
        </div>
'''

time_block = '<div>\n          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Time (Optional)</label>'
content = content.replace(time_block, day_selector_ui + '\n        ' + time_block)

with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
