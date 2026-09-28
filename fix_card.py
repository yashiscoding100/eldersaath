import re

with open('src/components/MedicalProfileCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'export function MedicalProfileCard({ initialProfile }: { initialProfile: any }) {',
    'export function MedicalProfileCard({ initialProfile, elderId }: { initialProfile: any, elderId?: string }) {'
)

content = content.replace(
    'body: JSON.stringify(form)',
    'body: JSON.stringify({ ...form, elderId })'
)

with open('src/components/MedicalProfileCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
