import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Use regex to find and replace the broken document.cookie line
pattern = r'document\.cookie\s*=\s*.*?ctiveElderId=.*?Lax;'
replacement = 'document.cookie = "activeElderId=" + elder.id + "; path=/; max-age=2592000; SameSite=Lax";'
content = re.sub(pattern, replacement, content)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed broken document.cookie syntax via regex")
