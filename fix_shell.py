import re

with open('src/components/child/ChildLayoutShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = 'import { setActiveElderAction } from "@/app/child/actions/elderActions"\n'
if import_statement not in content:
    content = content.replace('"use client"\n', '"use client"\n\n' + import_statement)

pattern = r'<a \s*key=\{elder\.id\}\s*href=\{`/api/child/active-elder\?elderId=\$\{elder\.id\}&redirect=\$\{encodeURIComponent\(pathname\)\}`\}\s*className=\{([^>]+)\}\s*>\s*\{elder\.name\}\s*\{elder\.id === activeElderId && <div className="w-2 h-2 rounded-full bg-blue-600"></div>\}\s*</a>'

replacement = r'''<button 
                          key={elder.id}
                          onClick={async () => {
                            await setActiveElderAction(elder.id, pathname);
                            setElderDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className={\1}
                        >
                          {elder.name}
                          {elder.id === activeElderId && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                      </button>'''

new_content = re.sub(pattern, replacement, content)

with open('src/components/child/ChildLayoutShell.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Replaced:', content != new_content)
