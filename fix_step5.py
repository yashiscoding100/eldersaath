import re

with open('src/app/elder/checkin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the bad setStep(2) from useEffect
content = content.replace('setAskSymptoms(false)\n          setStep(2)', 'setAskSymptoms(false)')

# 2. Update handleNext and handlePrev
old_nav = '''
  const totalSteps = 6
  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps))
  const handlePrev = () => setStep((s) => Math.max(s - 1, askSymptoms ? 1 : 2))
'''
new_nav = '''
  const totalSteps = 6
  const handleNext = () => setStep((s) => {
    if (s === 4 && !askSymptoms) return 6;
    return Math.min(s + 1, totalSteps);
  })
  const handlePrev = () => setStep((s) => {
    if (s === 6 && !askSymptoms) return 4;
    return Math.max(s - 1, 1);
  })
'''
content = content.replace(old_nav.strip(), new_nav.strip())

# 3. Revert the JSX condition for back button to just step > 1
content = content.replace('{step > (askSymptoms ? 1 : 2) && (', '{step > 1 && (')

# 4. Hide step 5 JSX if askSymptoms is false (just in case)
content = content.replace('{step === 5 && (', '{step === 5 && askSymptoms && (')

with open('src/app/elder/checkin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
