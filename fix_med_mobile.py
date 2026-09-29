import re

with open('src/app/child/medications/MedicineRow.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make buttons visible on mobile (remove opacity-0 and group-hover)
content = content.replace('inline-block opacity-0 group-hover:opacity-100 transition-opacity', 'inline-block')
content = content.replace('disabled:opacity-50 opacity-0 group-hover:opacity-100', 'disabled:opacity-50')

with open('src/app/child/medications/MedicineRow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
