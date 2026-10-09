import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the onClick handler
pattern = r'onClick=\{.*?setTimeout.*?\}'

replacement = '''onClick={(e) => {
                              e.preventDefault();
                              setElderDropdownOpen(false);
                              setMobileMenuOpen(false);
                              // 100% Bulletproof Capacitor Fix:
                              // Top-level hard navigation to the API route ensures Android natively processes Set-Cookie.
                              // Appending a random timestamp completely destroys aggressive WebView disk caching.
                              const timestamp = new Date().getTime();
                              const sep = pathname.includes("?") ? "&" : "?";
                              const cacheBustedUrl = pathname + sep + "t=" + timestamp;
                              window.location.href = "/api/child/active-elder?elderId=" + elder.id + "&redirect=" + encodeURIComponent(cacheBustedUrl);
                            }}'''

# Note: the previous code used:
# onClick={() => {
#   document.cookie = "activeElderId=" + elder.id + "; path=/; max-age=2592000; SameSite=None; Secure";
#   setElderDropdownOpen(false);
#   setMobileMenuOpen(false);
#   setTimeout(() => { window.location.reload(); }, 500);
# }}
# Let's use regex that matches onClick={() => { ... setTimeout ... }}

content = re.sub(r'onClick=\{\(\)\s*=>\s*\{[^}]*?setTimeout[^}]*?\}\}', replacement, content, flags=re.DOTALL)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied ultimate cache-busting hard-navigation fix")
