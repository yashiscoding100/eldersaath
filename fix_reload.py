import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add window.location.reload() to the onClick handler
old_click = '''onClick={async () => {
                            await setActiveElderAction(elder.id, pathname);
                            setElderDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}'''

new_click = '''onClick={async () => {
                            await setActiveElderAction(elder.id, pathname);
                            setElderDropdownOpen(false);
                            setMobileMenuOpen(false);
                            window.location.reload();
                          }}'''

content = content.replace(old_click, new_click)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added window.location.reload() to ChildLayoutShell")
