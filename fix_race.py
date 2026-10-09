import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the reload with a setTimeout to fix the Capacitor native bridge race condition
old_click = '''document.cookie = "activeElderId=" + elder.id + "; path=/; max-age=2592000; SameSite=Lax";
                              setElderDropdownOpen(false);
                              setMobileMenuOpen(false);
                              window.location.reload();'''

new_click = '''document.cookie = "activeElderId=" + elder.id + "; path=/; max-age=2592000; SameSite=Lax";
                              setElderDropdownOpen(false);
                              setMobileMenuOpen(false);
                              // Fix Capacitor race condition: wait 500ms for native bridge to write cookie before reloading
                              setTimeout(() => { window.location.reload(); }, 500);'''

content = content.replace(old_click, new_click)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added setTimeout to fix Capacitor cookie race condition!")
