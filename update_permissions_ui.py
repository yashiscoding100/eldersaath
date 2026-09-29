import re

with open('src/components/MandatoryPermissions.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Battery icon import
content = content.replace('import { AlertTriangle, Layers, Bell } from "lucide-react"', 'import { AlertTriangle, Layers, Bell, BatteryWarning } from "lucide-react"')

# Add state variables
state_vars = '''  const [overlayGranted, setOverlayGranted] = useState(true)
  const [pushGranted, setPushGranted] = useState(true)
  const [batteryGranted, setBatteryGranted] = useState(true)
  const [showBatteryInstructions, setShowBatteryInstructions] = useState(false)'''

content = content.replace('  const [overlayGranted, setOverlayGranted] = useState(true)\n  const [pushGranted, setPushGranted] = useState(true)', state_vars)

# Load battery completion state in checkPermissions
battery_check = '''
      const pushRes = await PushNotifications.checkPermissions()
      setPushGranted(pushRes.receive === "granted")
      
      const batDone = localStorage.getItem("batterySetupComplete") === "true"
      setBatteryGranted(batDone)
'''
content = content.replace('      const pushRes = await PushNotifications.checkPermissions()\n      setPushGranted(pushRes.receive === "granted")', battery_check)

# Update return condition
content = content.replace('if (overlayGranted && pushGranted) return null', 'if (overlayGranted && pushGranted && batteryGranted) return null')

# Add handler for Battery Settings
battery_handler = '''
  const handleOpenBatterySettings = async () => {
    alert("IMPORTANT FOR REDMI / SAMSUNG:\\n\\n1. Turn ON 'Autostart'\\n2. Set Battery Saver to 'No Restrictions'\\n3. Allow 'Display pop-up windows while running in background'.\\n\\nPress OK to open Settings now.");
    await AppPermissions.openAppSettings();
    setShowBatteryInstructions(true);
  }

  const handleFinishBattery = () => {
    localStorage.setItem("batterySetupComplete", "true");
    setBatteryGranted(true);
  }
'''
content = content.replace('  const handleRequestOverlay = async () => {', battery_handler + '\n  const handleRequestOverlay = async () => {')

# Inject UI Step 3
ui_step3 = '''
          {/* Step 3: Battery Optimization */}
          <div className={p-4 rounded-2xl border flex items-center gap-4 transition-all }>
            <div className={p-3 rounded-full }>
              <BatteryWarning className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white">3. Battery & Autostart</h3>
              <p className="text-xs text-slate-400">Fix Redmi/Samsung alarms</p>
            </div>
            {!batteryGranted && pushGranted && overlayGranted && !showBatteryInstructions && (
              <button onClick={handleOpenBatterySettings} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-sm transition whitespace-nowrap">
                Fix
              </button>
            )}
            {!batteryGranted && pushGranted && overlayGranted && showBatteryInstructions && (
              <button onClick={handleFinishBattery} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm transition whitespace-nowrap">
                I did it
              </button>
            )}
            {!batteryGranted && (!pushGranted || !overlayGranted) && (
              <span className="text-slate-500 text-xs font-bold pr-2">Wait</span>
            )}
            {batteryGranted && <span className="text-emerald-400 font-bold text-sm pr-2">Done</span>}
          </div>
'''
content = content.replace('        </div>\n      </div>\n    </div>', ui_step3 + '\n        </div>\n      </div>\n    </div>')

with open('src/components/MandatoryPermissions.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
