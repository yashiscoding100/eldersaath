import re

with open('src/app/elder/home/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if 'import { MedicalProfileCard }' not in content:
    content = content.replace('import { HealthCharts } from "@/components/HealthCharts"', 'import { HealthCharts } from "@/components/HealthCharts"\nimport { MedicalProfileCard } from "@/components/MedicalProfileCard"\nimport { Heart, Droplets, Activity } from "lucide-react"')

# Add the parsed vitals logic right after healthCheckDone
logic_addition = '''
  const bp = todayMeasurements.find(m => m.type === "BP")?.value || "--"
  const sugar = todayMeasurements.find(m => m.type === "SUGAR")?.value || "--"
  const spo2 = todayMeasurements.find(m => m.type === "SPO2")?.value || "--"
  const pulse = todayMeasurements.find(m => m.type === "PULSE")?.value || "--"
  const temp = todayMeasurements.find(m => m.type === "TEMP")?.value || "--"
  const weight = todayMeasurements.find(m => m.type === "WEIGHT")?.value || "--"
'''
content = content.replace('const showHealthCheckAsDone = healthCheckDone || !isCheckRequiredToday', 'const showHealthCheckAsDone = healthCheckDone || !isCheckRequiredToday\n' + logic_addition)

# Build the UI additions
vitals_ui = '''
        {/* Today's Vitals Summary */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Today's Vitals
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
              {healthCheckDone ? "✅ Updated Today" : (!isCheckRequiredToday ? "✅ Rest Day" : "⚠️ Awaiting Update")}
            </span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
            <div className="p-4 flex flex-col justify-between text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Pressure</span>
              <span className="text-xl font-black text-slate-800">{bp}</span>
            </div>
            <div className="p-4 flex flex-col justify-between text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Sugar</span>
              <span className="text-xl font-black text-slate-800">{sugar}</span>
            </div>
            <div className="p-4 flex flex-col justify-between text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SpO2</span>
              <span className="text-xl font-black text-slate-800">{spo2}</span>
            </div>
          </div>
        </div>

        {/* Medication Adherence */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Today's Medication Adherence</h4>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl font-black tracking-tight text-slate-900">
              {totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0}%
            </span>
            <span className="text-sm font-medium text-slate-500 mb-1">{takenMeds} of {totalMeds} taken today</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all" 
              style={{ width: ${totalMeds > 0 ? (takenMeds / totalMeds) * 100 : 0}% }}
            ></div>
          </div>
        </div>

        {/* Medical Profile */}
        <MedicalProfileCard initialProfile={profile} />
'''

content = content.replace('</div>\n\n        <a href="/elder/team"', '</div>\n' + vitals_ui + '\n        <a href="/elder/team"')

with open('src/app/elder/home/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
