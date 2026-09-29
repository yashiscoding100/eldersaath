import re

with open('src/app/api/cron/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

task_check = '''
      if (!task.time) continue
      
      let taskFreq = task.frequency;
      if (!taskFreq || taskFreq.toUpperCase() === "DAILY" || taskFreq.toUpperCase() === "WEEKLY" || taskFreq.toUpperCase() === "MONTHLY" || taskFreq.toUpperCase() === "ONCE") {
        taskFreq = "0,1,2,3,4,5,6";
      }
      if (!taskFreq.includes(istDayStr)) continue;
'''

content = content.replace('if (!task.time) continue', task_check.strip())

with open('src/app/api/cron/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
