import re
with open('src/app/elder/tasks/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add DeleteTaskButton import
if 'DeleteTaskButton' not in content:
    content = content.replace('import { ElderAddTaskForm } from "./ElderAddTaskForm"', 'import { ElderAddTaskForm } from "./ElderAddTaskForm"\nimport { DeleteTaskButton } from "@/app/child/tasks/DeleteTaskButton"')

# Add Delete button to the task card
# {task.description && <p className="text-lg text-gray-500 mt-1">{task.description}</p>}
# </div>
content = content.replace(
    '{task.description && <p className="text-lg text-gray-500 mt-1">{task.description}</p>}\n                  </div>',
    '{task.description && <p className="text-lg text-gray-500 mt-1">{task.description}</p>}\n                    <div className="mt-3"><DeleteTaskButton id={task.id} /></div>\n                  </div>'
)

with open('src/app/elder/tasks/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
