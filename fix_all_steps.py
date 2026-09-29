import re

with open('src/app/elder/checkin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update useEffect
old_use_effect = '''
        if (resData.askSymptoms === false) {
          setAskSymptoms(false)
        }
'''
new_use_effect = '''
        if (resData.askSymptoms === false) {
          setAskSymptoms(false)
          setStep(4)
        }
'''
content = content.replace(old_use_effect.strip(), new_use_effect.strip())

# 2. Update handlePrev
old_handle_prev = '''
    const handlePrev = () => setStep((s) => {
      if (s === 6 && !askSymptoms) return 4;
      return Math.max(s - 1, 1);
    })
'''
new_handle_prev = '''
    const handlePrev = () => setStep((s) => {
      if (s === 6 && !askSymptoms) return 4;
      return Math.max(s - 1, askSymptoms ? 1 : 4);
    })
'''
content = content.replace(old_handle_prev.strip(), new_handle_prev.strip())

# 3. Update Back button condition
content = content.replace('{step > 1 && (', '{step > (askSymptoms ? 1 : 4) && (')

with open('src/app/elder/checkin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
