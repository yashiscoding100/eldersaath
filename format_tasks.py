import os

with open('src/app/child/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add formatter function before return
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

content = content.replace('  return (', formatter + '\n  return (')

content = content.replace('{task.frequency}', '{formatFreq(task.frequency)}')

with open('src/app/child/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
