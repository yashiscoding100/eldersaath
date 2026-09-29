import re

files = [
    'src/app/elder/documents/page.tsx',
    'src/app/elder/health/page.tsx',
    'src/app/elder/reports/page.tsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the end of the text block:
    # </div>
    # <div className="flex gap-4 items-center">
    
    # Or in reports:
    # </div>
    # <div className="flex gap-4 items-center print:hidden">

    content = re.sub(
        r'(</p>\s*</div>)',
        r'\1\n        </div>',
        content,
        count=1
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

