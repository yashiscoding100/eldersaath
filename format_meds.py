import os

with open('src/app/child/medications/MedicineRow.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add formatter function
formatter = '''  const formatFreq = (f: string) => {
    if (!f || f.toLowerCase() === "daily" || f === "0,1,2,3,4,5,6") return "Every Day";
    const map: any = { "0": "Sun", "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat" };
    return f.split(",").map(d => map[d.trim()]).filter(Boolean).join(", ");
  }'''

content = content.replace('const handleDelete = async () => {', formatter + '\n\n  const handleDelete = async () => {')

content = content.replace('{med.frequency}', '{formatFreq(med.frequency)}')

with open('src/app/child/medications/MedicineRow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Update EditMedicineModal.tsx
with open('src/app/child/medications/EditMedicineModal.tsx', 'r', encoding='utf-8') as f:
    edit_content = f.read()

# 1. Ensure initial state doesn't wipe it
edit_content = edit_content.replace(
    'frequency: med.frequency,',
    'frequency: med.frequency.toLowerCase() === "daily" ? "0,1,2,3,4,5,6" : med.frequency,'
)

# 2. Add Day Selector UI
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
          </div>
'''

edit_content = edit_content.replace(
    '<div>\n            <label className="block text-sm font-bold text-slate-700 mb-1">Instructions (Optional)</label>',
    day_selector_ui + '\n          <div>\n            <label className="block text-sm font-bold text-slate-700 mb-1">Instructions (Optional)</label>'
)

with open('src/app/child/medications/EditMedicineModal.tsx', 'w', encoding='utf-8') as f:
    f.write(edit_content)

