import os
import re

# 1. Update src/app/child/tasks/page.tsx
with open('src/app/child/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Rename
content = content.replace('ChildTasks()', 'ChildThingsToDo()')
content = content.replace('"Care Tasks"', '"Things to Do"')
content = content.replace('Manage reminders and tasks', 'Manage reminders and things to do')
content = content.replace('"No active tasks"', '"Nothing to do yet"')
content = content.replace('Create daily reminders for water, exercise, or check-ins.', 'Add a new thing to do to get started.')
content = content.replace('Task Title', 'Title')

# Add Delete Button Import
if 'DeleteTaskButton' not in content:
    content = content.replace('import { Bell } from "lucide-react"', 'import { Bell } from "lucide-react"\nimport { DeleteTaskButton } from "./DeleteTaskButton"')

# Add Actions Column Header
content = content.replace('<th className="p-4 px-6">Frequency</th>\n                </tr>', '<th className="p-4 px-6">Frequency</th>\n                  <th className="p-4 px-6 text-right">Actions</th>\n                </tr>')

# Add Delete Button to row
content = content.replace(
    '<td className="p-4 px-6 text-slate-500 uppercase tracking-wider text-xs font-semibold">{task.frequency}</td>\n                  </tr>',
    '<td className="p-4 px-6 text-slate-500 uppercase tracking-wider text-xs font-semibold">{task.frequency}</td>\n                      <td className="p-4 px-6 text-right"><DeleteTaskButton id={task.id} /></td>\n                  </tr>'
)

with open('src/app/child/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update src/app/child/tasks/AddTaskForm.tsx
with open('src/app/child/tasks/AddTaskForm.tsx', 'r', encoding='utf-8') as f:
    form = f.read()

# Add frequency state
form = form.replace('const [triggerAlarm, setTriggerAlarm] = useState(false)', 'const [triggerAlarm, setTriggerAlarm] = useState(false)\n  const [frequency, setFrequency] = useState("DAILY")')

# Update payload
form = form.replace('triggerAlarm })', 'triggerAlarm, frequency })')

# Reset state
form = form.replace('setTriggerAlarm(false)', 'setTriggerAlarm(false)\n      setFrequency("DAILY")')

# Add UI field
freq_ui = '''
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="ONCE">Just Once</option>
            </select>
          </div>
'''
form = form.replace('          <div className="mb-4 flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">', freq_ui + '          <div className="mb-4 flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">')

# Rename button
form = form.replace('Add Task', 'Add Thing to Do')
form = form.replace('New Task', 'New Thing to Do')

with open('src/app/child/tasks/AddTaskForm.tsx', 'w', encoding='utf-8') as f:
    f.write(form)
