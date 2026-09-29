import re

with open('src/components/MandatoryPermissions.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_div1 = '          <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all `}>'
good_div1 = '          <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${batteryGranted ? "bg-emerald-900/30 border-emerald-500/30 opacity-50" : "bg-slate-700 border-slate-600"}`}>'

bad_div2 = '            <div className={`p-3 rounded-full `}>'
good_div2 = '            <div className={`p-3 rounded-full ${batteryGranted ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"}`}>'

content = content.replace(bad_div1, good_div1).replace(bad_div2, good_div2)

with open('src/components/MandatoryPermissions.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
