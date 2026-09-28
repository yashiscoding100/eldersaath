package com.eldersaath.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.RemoteMessage;
import com.capacitorjs.plugins.pushnotifications.MessagingService;

public class MyMessagingService extends MessagingService {

    // THROTTLE: Only allow one alarm every 10 seconds to prevent infinite storm
    private static long lastAlarmTime = 0;
    private static final long ALARM_COOLDOWN_MS = 10000; // 10 seconds

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        
        if (remoteMessage.getData().size() > 0 && "ALARM".equals(remoteMessage.getData().get("type"))) {
            
            // THROTTLE CHECK: Skip if we already fired an alarm in the last 10 seconds
            long now = System.currentTimeMillis();
            if (now - lastAlarmTime < ALARM_COOLDOWN_MS) {
                android.util.Log.e("ALARM_DEBUG", "THROTTLED - Skipping duplicate alarm (fired " + (now - lastAlarmTime) + "ms ago)");
                return; // DO NOT call super, DO NOT fire another alarm
            }
            lastAlarmTime = now;
            
            android.util.Log.e("ALARM_DEBUG", "FCM ALARM RECEIVED - PROCESSING (single fire)");
            
            // DO NOT call super.onMessageReceived() for ALARM type messages!
            // The parent Capacitor MessagingService re-dispatches the message and causes duplicates.
            
            String label = remoteMessage.getData().get("label");
            if (label == null) label = "EMERGENCY ALARM";
            
            String body = remoteMessage.getData().get("body");
            if (body == null) body = "If you don't want to take your medicine right now, snooze it and take it after 5 mins.";

            String snoozeText = remoteMessage.getData().get("snoozeText");
            String snoozeDurationStr = remoteMessage.getData().get("snoozeDuration");
            int snoozeDuration = 10;
            if (snoozeDurationStr != null) {
                try { snoozeDuration = Integer.parseInt(snoozeDurationStr); } catch (Exception ignored) {}
            }
            String elderId = remoteMessage.getData().get("elderId");
            if (snoozeText == null) snoozeText = "I'll take the medicines later";

            try {
                // ACQUIRE WAKE LOCK TO FORCE CPU AWAKE
                PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
                if (powerManager != null) {
                    PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                        PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP, 
                        "ElderSaath::AlarmWakeLock"
                    );
                    wakeLock.acquire(3 * 60 * 1000L); // 3 minutes
                }
                
                // Create notification channel
                NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                String channelId = "whatsapp_style_alarms";

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    NotificationChannel channel = new NotificationChannel(
                            channelId,
                            "Emergency Alarms",
                            NotificationManager.IMPORTANCE_HIGH
                    );
                    channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                    channel.setBypassDnd(true);
                    notificationManager.createNotificationChannel(channel);
                }

                Intent fullScreenIntent = new Intent(this, AlarmActivity.class);
                fullScreenIntent.putExtra("label", label);
                fullScreenIntent.putExtra("body", body);
                fullScreenIntent.putExtra("snoozeText", snoozeText);
                fullScreenIntent.putExtra("actionText", actionText);
                fullScreenIntent.putExtra("snoozeDuration", snoozeDuration);
                if (elderId != null) fullScreenIntent.putExtra("elderId", elderId);
                fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

                int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    flags |= PendingIntent.FLAG_IMMUTABLE;
                }

                PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                        this, 0, fullScreenIntent, flags
                );

                // Use a FIXED notification ID so duplicates just replace each other instead of stacking
                int ALARM_NOTIFICATION_ID = 99999;

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
                android.util.Log.e("ALARM_DEBUG", "Notification Fired with FullScreenIntent!");
                
                // FORCE the Activity to start directly (needs SYSTEM_ALERT_WINDOW permission)
                try {
                    startActivity(fullScreenIntent);
                    android.util.Log.e("ALARM_DEBUG", "Forced startActivity called directly!");
                } catch (Exception e) {
                    android.util.Log.e("ALARM_DEBUG", "Could not force startActivity: " + e.getMessage());
                }
                
            } catch (Exception e) {
                android.util.Log.e("ALARM_DEBUG", "FATAL CRASH IN JAVA: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            // For non-alarm messages (regular notifications), let Capacitor handle it normally
            super.onMessageReceived(remoteMessage);
            android.util.Log.e("ALARM_DEBUG", "Received normal push, passed to Capacitor.");
        }
    }
}
