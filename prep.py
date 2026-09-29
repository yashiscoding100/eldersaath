import re

# 1. Update MyMessagingService.java
with open('android/app/src/main/java/com/eldersaath/app/MyMessagingService.java', 'r', encoding='utf-8') as f:
    msg_service = f.read()

# Make it ALWAYS build the notification, but pass sticky state to intent
old_block = '''                // Check if user requested sticky notification
                boolean showSticky = true;
                if (remoteMessage.getData().containsKey("stickyNotification")) {
                    String stickyVal = remoteMessage.getData().get("stickyNotification");
                    if ("false".equals(stickyVal)) {
                        showSticky = false;
                    }
                }

                if (showSticky) {
                    NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                            .setSmallIcon(android.R.drawable.ic_dialog_alert)
                            .setContentTitle(remoteMessage.getData().containsKey("actionText") ? remoteMessage.getData().get("actionText") : "ALARM")
                            .setContentText(label)
                            .setPriority(NotificationCompat.PRIORITY_MAX)
                            .setCategory(NotificationCompat.CATEGORY_ALARM)
                            .setFullScreenIntent(fullScreenPendingIntent, true)
                            .setAutoCancel(true)
                            .setOngoing(true);

                    notificationManager.notify(ALARM_NOTIFICATION_ID, builder.build());
                    Log.e("ALARM_DEBUG", "Sticky Notification Fired with FullScreenIntent!");
                } else {
                    Log.e("ALARM_DEBUG", "Sticky Notification Skipped by User Preference!");
                }'''

# We also need to add fullScreenIntent.putExtra BEFORE the PendingIntent is created.
# Let's just do a simpler targeted replace.
