import re

with open('src/app/elder/medications/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad = r'\{canManageMeds && <ElderDeleteMedicationButton medicationId=\{med\.id\} medicationName=\{med\.name\} />\}<h2 className=\{.ext-2xl font-bold \$\{isTaken \? .text-green-800 line-through. : .text-gray-900.\}\}>\{med\.name\}</h2>'
good = '{canManageMeds && <div className="mb-2"><ElderDeleteMedicationButton medicationId={med.id} medicationName={med.name} /></div>}\n                  <h2 className={	ext-2xl font-bold }>{med.name}</h2>'

content = re.sub(bad, good, content)

with open('src/app/elder/medications/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
