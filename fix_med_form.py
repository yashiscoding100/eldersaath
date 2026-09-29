import re

with open('src/app/child/medications/AddMedicineForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change initial state of formData.frequency from "Daily" to "0,1,2,3,4,5,6"
content = content.replace('frequency: "Daily"', 'frequency: "0,1,2,3,4,5,6"')

# Find the Instructions block to insert before it
# <div>\n            <label className="block text-sm font-bold text-slate-700 mb-1">Instructions (Optional)</label>
# We will replace this block with the days selector + the instructions block
day_selector_ui = '''
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">Days of the Week</label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: "1", label: "Mon" },
                { val: "2", label: "Tue" },
                { val: "3", label: "Wed" },
                { val: "4", label: "Thu" },
                { val: "5", label: "Fri" },
                { val: "6", label: "Sat" },
                { val: "0", label: "Sun" },
              ].map(day => {
                const isSelected = formData.frequency.includes(day.val);
                return (
                  <button
                    key={day.val}
                    type="button"
                    onClick={() => {
                      let arr = formData.frequency ? formData.frequency.split(',').filter(d => d) : [];
                      if (isSelected) arr = arr.filter(d => d !== day.val);
                      else arr.push(day.val);
                      setFormData({...formData, frequency: arr.join(',')});
                    }}
                    className={px-3 py-1.5 rounded-full text-sm font-bold transition }
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
            {formData.frequency.length === 0 && <p className="text-xs text-red-500 mt-1">Please select at least one day.</p>}
          </div>
'''

content = content.replace(
    '<div>\n            <label className="block text-sm font-bold text-slate-700 mb-1">Instructions (Optional)</label>',
    day_selector_ui + '\n          <div>\n            <label className="block text-sm font-bold text-slate-700 mb-1">Instructions (Optional)</label>'
)

with open('src/app/child/medications/AddMedicineForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
