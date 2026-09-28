import re

with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'r', encoding='utf-8') as f:
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
    'setDescription("")\n        setTime("")\n        setTriggerAlarm(false)'
)

# 3. Payload
content = content.replace(
    'body: JSON.stringify({ title, description })',
    'body: JSON.stringify({ title, description, time: convertTo12Hour(time), triggerAlarm })'
)

# 4. Form inputs
form_addition = '''
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Time (Optional)</label>
            <input 
              type="time" 
              value={time} 
              onChange={e => setTime(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 font-bold"
            />
          </div>
          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setTriggerAlarm(!triggerAlarm)}
              className={w-14 h-7 rounded-full relative transition-colors }
            >
              <div className={w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all } />
            </button>
            <div className="flex-1">
              <p className="font-bold text-slate-900">Important Task Alarm</p>
              <p className="text-sm text-slate-500">Rings loud full-screen alarm.</p>
            </div>
          </div>
'''
content = content.replace(
    '<button type="submit"',
    form_addition + '\n          <button type="submit"'
)

with open('src/app/elder/tasks/ElderAddTaskForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
