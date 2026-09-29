import re

with open('src/app/child/settings/ElderAlarmSettings.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Props
content = content.replace(
    'initialSosEnabled: boolean, initialCanManageMeds: boolean',
    'initialSosEnabled: boolean, initialCanManageMeds: boolean, initialStickyAlarmNotification?: boolean'
)
content = content.replace(
    'initialSosEnabled: boolean,\n  initialCanManageMeds: boolean\n}',
    'initialSosEnabled: boolean,\n  initialCanManageMeds: boolean,\n  initialStickyAlarmNotification?: boolean\n}'
)

# 2. Add state
content = content.replace(
    'const [canManageMeds, setCanManageMeds] = useState(initialCanManageMeds)',
    'const [canManageMeds, setCanManageMeds] = useState(initialCanManageMeds)\n  const [stickyAlarmNotification, setStickyAlarmNotification] = useState(initialStickyAlarmNotification ?? true)'
)

# 3. Update Save Body
content = content.replace(
    'body: JSON.stringify({ elderId, alarmSnoozeText: snoozeText, alarmSnoozeDuration: snoozeDuration, sosEnabled, canManageMeds })',
    'body: JSON.stringify({ elderId, alarmSnoozeText: snoozeText, alarmSnoozeDuration: snoozeDuration, sosEnabled, canManageMeds, stickyAlarmNotification })'
)

# 4. Add UI Toggle
toggle_ui = '''
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-700 text-sm">Sticky Alarm Notification</p>
            <p className="text-xs text-slate-500">Show a persistent tray notification during full-screen alarms.</p>
          </div>
          <button 
            onClick={() => setStickyAlarmNotification(!stickyAlarmNotification)}
            className={w-12 h-6 rounded-full relative transition-colors }
          >
            <span className={bsolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform } />
          </button>
        </div>
'''
content = content.replace(
    '</div>\n      </div>\n\n      {error &&',
    '</div>\n' + toggle_ui + '      </div>\n\n      {error &&'
)

with open('src/app/child/settings/ElderAlarmSettings.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
