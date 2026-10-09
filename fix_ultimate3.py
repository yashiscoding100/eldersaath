import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'onClick=\{\(\) => \{\s*// Bypass Capacitor.*?setTimeout.*?\}\}', re.DOTALL)

new_block = '''onClick={(e) => {
                              e.preventDefault();
                              setElderDropdownOpen(false);
                              setMobileMenuOpen(false);
                              const timestamp = new Date().getTime();
                              const sep = pathname.includes("?") ? "&" : "?";
                              const cacheBustedUrl = pathname + sep + "t=" + timestamp;
                              window.location.href = "/api/child/active-elder?elderId=" + elder.id + "&redirect=" + encodeURIComponent(cacheBustedUrl);
                            }}'''

content = pattern.sub(new_block, content)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied fix using flexible regex")
