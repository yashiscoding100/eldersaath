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

# 3. Update Save logic (Wait, ElderAlarmSettings saves to /api/child/elder-settings, not /api/elder/preferences!)
# Let's check what API it calls.
