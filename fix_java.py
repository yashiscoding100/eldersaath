import re

with open('android/app/src/main/java/com/eldersaath/app/MyMessagingService.java', 'r', encoding='utf-8') as f:
    content = f.read()

old_java = '''
                NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(android.R.drawable.ic_dialog_alert)
                        .setContentTitle("EMERGENCY")
                        .setContentText(label)
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setCategory(NotificationCompat.CATEGORY_ALARM)
                        .setFullScreenIntent(fullScreenPendingIntent, true)
                        .setAutoCancel(true)
                        .setOngoing(true);

                notificationManager.notify(ALARM_NOTIFICATION_ID, builder.build());
                Log.e("ALARM_DEBUG", "Notification Fired with FullScreenIntent!");
                
                // FORCE the Activity to start directly (needs SYSTEM_ALERT_WINDOW permission)
                try {
                    startActivity(fullScreenIntent);
                    Log.e("ALARM_DEBUG", "Forced startActivity called directly!");
                } catch (Exception e) {
                    Log.e("ALARM_DEBUG", "Could not force startActivity: " + e.getMessage());
                }
'''

new_java = '''
                // Check if user requested sticky notification
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
                }
                
                // FORCE the Activity to start directly (needs SYSTEM_ALERT_WINDOW permission)
                try {
                    startActivity(fullScreenIntent);
                    Log.e("ALARM_DEBUG", "Forced startActivity called directly!");
                } catch (Exception e) {
                    Log.e("ALARM_DEBUG", "Could not force startActivity: " + e.getMessage());
                }
'''
content = content.replace(old_java.strip(), new_java.strip())

with open('android/app/src/main/java/com/eldersaath/app/MyMessagingService.java', 'w', encoding='utf-8') as f:
    f.write(content)
