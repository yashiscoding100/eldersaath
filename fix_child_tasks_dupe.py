import re

with open('src/app/child/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the duplicated formatFreq and misplaced returns
bad_chunk = '''  if (!relationship) {
  
  const formatFreq = (f: string) => {
    if (!f || f.toUpperCase() === "DAILY" || f === "0,1,2,3,4,5,6") return "Every Day";
    if (f.toUpperCase() === "WEEKLY") return "Weekly";
    if (f.toUpperCase() === "MONTHLY") return "Monthly";
    if (f.toUpperCase() === "ONCE") return "Once";
    const map: any = { "0": "Sun", "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat" };
    return f.split(",").map(d => map[d.trim()]).filter(Boolean).join(", ");
  }

  return ('''

good_chunk = '''  if (!relationship) {
  return ('''

content = content.replace(bad_chunk, good_chunk)

with open('src/app/child/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
