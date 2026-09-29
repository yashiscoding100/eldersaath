import re

with open('src/app/elder/home/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">.*?<HealthCharts .*?/>\s*</div>'

replacement = '''<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <a href="/elder/health" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Activity className="w-6 h-6" /></div>
              <div>
                <h2 className="font-bold text-slate-900">Health History</h2>
                <p className="text-sm text-slate-500 mt-1">Graphs & Vitals Table</p>
              </div>
            </a>
            <a href="/elder/documents" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <div>
                <h2 className="font-bold text-slate-900">Medical Vault</h2>
                <p className="text-sm text-slate-500 mt-1">Upload & View Documents</p>
              </div>
            </a>
            <a href="/elder/reports" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg></div>
              <div>
                <h2 className="font-bold text-slate-900">AI Health Reports</h2>
                <p className="text-sm text-slate-500 mt-1">Weekly AI Summaries</p>
              </div>
            </a>
          </div>'''

content = re.sub(target, replacement, content, flags=re.DOTALL)
with open('src/app/elder/home/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
