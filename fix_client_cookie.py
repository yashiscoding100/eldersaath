import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the onClick handler to set document.cookie manually before reloading
old_click = '''onClick={async () => {
                            await setActiveElderAction(elder.id, pathname);
                            setElderDropdownOpen(false);
                            setMobileMenuOpen(false);
                            window.location.reload();
                          }}'''

new_click = '''onClick={() => {
                            // Bypass Capacitor's network interceptor dropping Set-Cookie headers
                            // by setting the cookie manually on the client side!
                            document.cookie = ctiveElderId=; path=/; max-age=2592000; SameSite=Lax;
                            setElderDropdownOpen(false);
                            setMobileMenuOpen(false);
                            window.location.reload();
                          }}'''

content = content.replace(old_click, new_click)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ChildLayoutShell to use client-side document.cookie")
