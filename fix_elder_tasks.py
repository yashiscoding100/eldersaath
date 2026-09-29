import os

# Update ElderTasks
with open('src/app/elder/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('ElderTasks()', 'ElderThingsToDo()')
content = content.replace('Your Daily Tasks', 'Things to Do')
content = content.replace('Here is what you need to do today.', 'Here are the things you need to do today.')
content = content.replace('Important Task Alarm', 'Important Alarm')
with open('src/app/elder/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Update ElderAddTaskForm
with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('Add a Personal Task', 'Add something to do')
content = content.replace('Add a New Task', 'Add a New Thing to Do')
content = content.replace('Task Title', 'Title')
content = content.replace('Save Task', 'Save')
content = content.replace('Important Task Alarm', 'Important Alarm')

# Add Frequency support to Elder form!
content = content.replace('const [triggerAlarm, setTriggerAlarm] = useState(false)', 'const [triggerAlarm, setTriggerAlarm] = useState(false)\n  const [frequency, setFrequency] = useState("DAILY")')
content = content.replace('triggerAlarm })', 'triggerAlarm, frequency })')
content = content.replace('setTriggerAlarm(false)', 'setTriggerAlarm(false)\n      setFrequency("DAILY")')

freq_ui = '''
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="ONCE">Just Once</option>
            </select>
          </div>
'''
content = content.replace('          <div className="mb-4 flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100">', freq_ui + '          <div className="mb-4 flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100">')

with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
