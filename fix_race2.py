import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Just replace window.location.reload() globally in this file (there are only 2 occurrences for the buttons)
content = content.replace("window.location.reload();", "setTimeout(() => { window.location.reload(); }, 500);")

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced window.location.reload() with setTimeout")
