import re

with open('src/app/child/tasks/AddTaskForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = "import { convertTo12Hour } from '@/lib/timeUtils'\n" + content

# 1. State hooks
content = content.replace(
    'const [description, setDescription] = useState("")',
    'const [description, setDescription] = useState("")\n  const [time, setTime] = useState("")\n  const [triggerAlarm, setTriggerAlarm] = useState(false)'
)

# 2. Reset state
content = content.replace(
    'setDescription("")',
    'setDescription("")\n      setTime("")\n      setTriggerAlarm(false)'
)

# 3. Payload
content = content.replace(
    'body: JSON.stringify({ elderId, title, description })',
    'body: JSON.stringify({ elderId, title, description, time: convertTo12Hour(time), triggerAlarm })'
)

# 4. Form inputs
form_addition = '''
          <div>
            <label className="block text-sm font-medium mb-1">Time (Optional)</label>
            <input type="time" className="text-gray-900 font-bold w-full border p-2 rounded" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setTriggerAlarm(!triggerAlarm)}
              className={w-12 h-6 rounded-full relative transition-colors }
            >
              <div className={w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all } />
            </button>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Important Task (Trigger Alarm)</p>
              <p className="text-xs text-slate-500">Will sound a loud full-screen alarm on their device.</p>
            </div>
          </div>
'''
content = content.replace(
    '<div className="flex justify-end gap-2 mt-6">',
    form_addition + '\n          <div className="flex justify-end gap-2 mt-6">'
)

with open('src/app/child/tasks/AddTaskForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
