import re

with open('src/app/api/cron/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add IST Day calculation
ist_calc = '''
    const istDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const istDayStr = istDate.getDay().toString();
'''

content = content.replace('const istOptions24:', ist_calc + '\n    const istOptions24:')

# Add check to Medication loop
med_check = '''
      let medFreq = med.frequency;
      if (!medFreq || medFreq.toLowerCase() === "daily" || medFreq === "") medFreq = "0,1,2,3,4,5,6";
      if (!medFreq.includes(istDayStr)) continue;
'''
content = content.replace('const medTime = med.time', med_check + '\n      const medTime = med.time')

# Write back
with open('src/app/api/cron/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
