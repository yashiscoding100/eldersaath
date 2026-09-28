import re

with open('src/app/child/settings/HealthParameterSettings.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Props
content = content.replace(
    'initialVitals: string // e.g., "BP,SUGAR,SPO2,PULSE,TEMP,WEIGHT"\n}',
    'initialVitals: string\n  initialAskSymptoms?: boolean\n}'
)

# Update signature and state
content = content.replace(
    'export function HealthParameterSettings({ elderId, elderName, initialVitals }: Props) {',
    'export function HealthParameterSettings({ elderId, elderName, initialVitals, initialAskSymptoms = true }: Props) {\n  const [askSymptoms, setAskSymptoms] = useState(initialAskSymptoms)'
)

# Update fetch body
content = content.replace(
    'body: JSON.stringify({ elderId, requiredVitals: activeVitals.join(",") })',
    'body: JSON.stringify({ elderId, requiredVitals: activeVitals.join(","), askSymptoms })'
)

# Add toggle UI inside the modal (search for grid grid-cols-2)
toggle_ui = '''
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 mb-2">Health Questionnaire</h4>
          <p className="text-sm text-slate-500 mb-4">Ask the elder about symptoms (chest pain, dizziness, etc.) before taking vitals.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAskSymptoms(!askSymptoms)}
              className={w-14 h-7 rounded-full relative transition-colors }
            >
              <div className={w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all } />
            </button>
            <span className="text-sm font-bold text-slate-700">{askSymptoms ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
'''

content = content.replace(
    '</div>\n\n        {message && (',
    '</div>\n' + toggle_ui + '\n        {message && ('
)

with open('src/app/child/settings/HealthParameterSettings.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
