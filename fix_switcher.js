const fs = require('fs');

let content = fs.readFileSync('src/components/child/ChildLayoutShell.tsx', 'utf8');

const switcherJSX = 
              <div className="relative" ref={elderDropdownRef}>
                <button 
                  onClick={() => setElderDropdownOpen(!elderDropdownOpen)}
                  className="flex items-center gap-1 font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  {elderName} <span className="text-[10px]">?</span>
                </button>
                {elderDropdownOpen && elders && elders.length > 0 && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                    <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Care Recipient</p>
                    {elders.map(elder => (
                      <button 
                        key={elder.id}
                        onClick={() => {
                          document.cookie = \ctiveElderId=\; path=/\;
                          window.location.reload();
                        }}
                        className={\w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex justify-between items-center \\}
                      >
                        {elder.name}
                        {elder.id === activeElderId && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
;

// Desktop
const desktopRegex = /<button className="flex items-center gap-1 font-bold text-slate-900 hover:text-blue-600 transition-colors">[\s\S]*?<\/button>/;
content = content.replace(desktopRegex, switcherJSX.trim());

// Mobile
const mobileRegex = /<span className="font-bold text-lg tracking-tight">ElderSaath<\/span>/;
const mobileReplacement = 
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-tight">ElderSaath</span>
            
          </div>
;
content = content.replace(mobileRegex, mobileReplacement.trim());

fs.writeFileSync('src/components/child/ChildLayoutShell.tsx', content, 'utf8');
console.log("Done");
