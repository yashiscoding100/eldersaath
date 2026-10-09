import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken document.cookie string
content = content.replace("document.cookie =  ctiveElderId=; path=/; max-age=2592000; SameSite=Lax;", 'document.cookie = "activeElderId=" + elder.id + "; path=/; max-age=2592000; SameSite=Lax";')

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed broken document.cookie syntax")
