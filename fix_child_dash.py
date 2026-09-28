import re

with open('src/app/child/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { MedicalProfileCard }' not in content:
    content = content.replace('import { ElderAlarmSettings } from "./ElderAlarmSettings"', 'import { ElderAlarmSettings } from "./ElderAlarmSettings"\nimport { MedicalProfileCard } from "@/components/MedicalProfileCard"')

addition = '''
            <div className="bg-white p-6 shadow-sm border border-slate-200 rounded-2xl overflow-hidden mt-6">
              <h2 className="font-bold text-slate-900 text-lg mb-2">Elder Medical Records</h2>
              <p className="text-sm text-slate-500 mb-4">Update {relationship.elder.name}'s medical profile.</p>
              <MedicalProfileCard initialProfile={elderProfile} />
            </div>
'''
content = content.replace('/>\n            </>', '/>\n' + addition + '            </>')

with open('src/app/child/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
