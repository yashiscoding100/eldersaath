import re

with open('src/app/child/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add getActiveElder import if not exists
if 'getActiveElder' not in content:
    content = content.replace('import { prisma } from "@/lib/prisma"', 'import { prisma } from "@/lib/prisma"\nimport { getActiveElder } from "@/lib/activeElder"')

pattern = r'const relationships = await prisma\.caregiverRelationship\.findMany\(\{\s*where: \{ childId: session\.user\.id \},\s*include: \{ elder: \{ include: \{ elderProfile: true \} \} \}\s*\}\)'

replacement = r'''const relationships = await prisma.caregiverRelationship.findMany({
    where: { childId: session.user.id },
    include: { elder: { include: { elderProfile: true } } }
  })

  const activeRelationship = await getActiveElder(session.user.id)'''

content = re.sub(pattern, replacement, content)

pattern2 = r'relationships\.filter\(r => r\.status === "ACTIVE"\)\.map'
replacement2 = r'((activeRelationship && activeRelationship.status === "ACTIVE") ? [activeRelationship] : []).map'

content = content.replace(pattern2, replacement2)

with open('src/app/child/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard updated successfully!")
