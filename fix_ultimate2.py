import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''onClick={() => {
                              // Bypass Capacitor's network interceptor dropping Set-Cookie headers
                              // by setting the cookie manually on the client side!
                              document.cookie = "activeElderId=" + elder.id + "; path=/; max-age=2592000; SameSite=None; Secure";
                              setElderDropdownOpen(false);
                              setMobileMenuOpen(false);
                              setTimeout(() => { window.location.reload(); }, 500);
                            }}'''

new_block = '''onClick={(e) => {
                              e.preventDefault();
                              setElderDropdownOpen(false);
                              setMobileMenuOpen(false);
                              const timestamp = new Date().getTime();
                              const sep = pathname.includes("?") ? "&" : "?";
                              const cacheBustedUrl = pathname + sep + "t=" + timestamp;
                              window.location.href = "/api/child/active-elder?elderId=" + elder.id + "&redirect=" + encodeURIComponent(cacheBustedUrl);
                            }}'''

content = content.replace(old_block, new_block)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied ultimate cache-busting hard-navigation fix")
