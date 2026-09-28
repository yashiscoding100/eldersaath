import re

with open('src/app/elder/checkin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add askSymptoms state
content = content.replace('const [requiredVitals, setRequiredVitals] = useState<string[]>(["BP", "SUGAR", "SPO2", "PULSE", "TEMP", "WEIGHT"])', 'const [requiredVitals, setRequiredVitals] = useState<string[]>(["BP", "SUGAR", "SPO2", "PULSE", "TEMP", "WEIGHT"])\n  const [askSymptoms, setAskSymptoms] = useState(true)')

# 2. Update fetch logic
fetch_replace = '''
      .then(resData => {
        if (resData.requiredVitals) {
          setRequiredVitals(resData.requiredVitals.split(","))
        }
        if (resData.askSymptoms === false) {
          setAskSymptoms(false)
          setStep(2)
        }
      })
'''
content = re.sub(r'\.then\(resData => \{.*?\n\s*\}\)', fetch_replace.strip('\n'), content, flags=re.DOTALL)

# 3. Update handlePrev
content = content.replace('const handlePrev = () => setStep((s) => Math.max(s - 1, 1))', 'const handlePrev = () => setStep((s) => Math.max(s - 1, askSymptoms ? 1 : 2))')

# 4. Update JSX step > 1 condition
content = content.replace('{step > 1 && (', '{step > (askSymptoms ? 1 : 2) && (')

with open('src/app/elder/checkin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
