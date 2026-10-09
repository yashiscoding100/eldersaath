import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("SameSite=Lax", "SameSite=None; Secure")

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated cookie SameSite to None; Secure")
