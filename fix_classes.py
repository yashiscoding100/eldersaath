import re

# AddMedicineForm
with open('src/app/child/medications/AddMedicineForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_class = 'className={px-3 py-1.5 rounded-full text-sm font-bold transition }'
good_class = 'className={`px-3 py-1.5 rounded-full text-sm font-bold transition ${isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}'

content = content.replace(bad_class, good_class)

with open('src/app/child/medications/AddMedicineForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# EditMedicineModal
with open('src/app/child/medications/EditMedicineModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(bad_class, good_class)

with open('src/app/child/medications/EditMedicineModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

