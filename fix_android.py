import re

with open('android/app/src/main/java/com/eldersaath/app/MyMessagingService.java', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert to always posting the notification so Android allows full screen intent.
# But dynamically set .setOngoing(showSticky).

# First, find where intent is created and inject the sticky flag
content = content.replace(
    'fullScreenIntent.putExtra("snoozeDuration", snoozeDuration);',
    'fullScreenIntent.putExtra("snoozeDuration", snoozeDuration);\n                boolean showSticky = true;\n                if (remoteMessage.getData().containsKey("stickyNotification")) { if ("false".equals(remoteMessage.getData().get("stickyNotification"))) showSticky = false; }\n                fullScreenIntent.putExtra("stickyNotification", showSticky);'
)

# Then replace the notification block
old_block = r'// Check if user requested sticky notification.*?Log\.e\("ALARM_DEBUG", "Sticky Notification Skipped by User Preference!"\);\s*\}'

new_block = '''
                NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(android.R.drawable.ic_dialog_alert)
                        .setContentTitle(remoteMessage.getData().containsKey("actionText") ? remoteMessage.getData().get("actionText") : "ALARM")
                        .setContentText(label)
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setCategory(NotificationCompat.CATEGORY_ALARM)
                        .setFullScreenIntent(fullScreenPendingIntent, true)
                        .setAutoCancel(true)
                        .setOngoing(showSticky);

                notificationManager.notify(ALARM_NOTIFICATION_ID, builder.build());
                Log.e("ALARM_DEBUG", "Notification Fired with FullScreenIntent! Sticky: " + showSticky);
'''

content = re.sub(old_block, new_block.strip(), content, flags=re.DOTALL)

with open('android/app/src/main/java/com/eldersaath/app/MyMessagingService.java', 'w', encoding='utf-8') as f:
    f.write(content)

# Now update AlarmActivity to cancel the notification if it's not meant to be sticky
with open('android/app/src/main/java/com/eldersaath/app/AlarmActivity.java', 'r', encoding='utf-8') as f:
    alarm_content = f.read()

cancel_code = '''
        boolean stickyNotification = getIntent().getBooleanExtra("stickyNotification", true);
        if (!stickyNotification) {
            try {
                android.app.NotificationManager notificationManager = (android.app.NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                notificationManager.cancel(99999);
            } catch (Exception e) {}
        }
'''

alarm_content = alarm_content.replace(
    'String body = getIntent().getStringExtra("body");',
    'String body = getIntent().getStringExtra("body");\n' + cancel_code
)

with open('android/app/src/main/java/com/eldersaath/app/AlarmActivity.java', 'w', encoding='utf-8') as f:
    f.write(alarm_content)
