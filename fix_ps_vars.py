import re

with open('src/app/api/tasks/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('body:  added a new thing to do: ,', 'body: ${session.user.name} added a new thing to do: ,')

with open('src/app/api/tasks/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/app/child/tasks/DeleteTaskButton.tsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace('await fetch(/api/tasks?id=, { method: "DELETE" })', 'await fetch(/api/tasks?id=, { method: "DELETE" })')

with open('src/app/child/tasks/DeleteTaskButton.tsx', 'w', encoding='utf-8') as f:
    f.write(content2)
