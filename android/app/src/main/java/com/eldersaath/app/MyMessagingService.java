package com.eldersaath.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.RemoteMessage;
import com.capacitorjs.plugins.pushnotifications.MessagingService;

public class MyMessagingService extends MessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        
        if (remoteMessage.getData().size() > 0 && "ALARM".equals(remoteMessage.getData().get("type"))) {
            android.util.Log.e("ALARM_DEBUG", "FCM ALARM RECEIVED IN BACKGROUND!");
            
            String label = remoteMessage.getData().get("label");
            if (label == null) label = "EMERGENCY ALARM";
            
            String body = remoteMessage.getData().get("body");
            if (body == null) body = "If you don't want to take your medicine right now, snooze it and take it after 5 mins.";

            String snoozeText = remoteMessage.getData().get("snoozeText");
            if (snoozeText == null) snoozeText = "I'll take the medicines later";

            try {
                // THE WHATSAPP METHOD: Full-Screen Intent Notification
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
                    android.util.Log.e("ALARM_DEBUG", "Notification Channel Created");
                }

                Intent fullScreenIntent = new Intent(this, AlarmActivity.class);
                fullScreenIntent.putExtra("label", label);
                fullScreenIntent.putExtra("body", body);
                fullScreenIntent.putExtra("snoozeText", snoozeText);
                fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

                int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    flags |= PendingIntent.FLAG_IMMUTABLE;
                }

                PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                        this,
                        0,
                        fullScreenIntent,
                        flags
                );
                
                android.util.Log.e("ALARM_DEBUG", "PendingIntent Created");

                NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(android.R.drawable.ic_dialog_alert)
                        .setContentTitle("EMERGENCY")
                        .setContentText(label)
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setCategory(NotificationCompat.CATEGORY_ALARM)
                        .setFullScreenIntent(fullScreenPendingIntent, true)
                        .setAutoCancel(true)
                        .setOngoing(true);

                notificationManager.notify((int) System.currentTimeMillis(), builder.build());
                android.util.Log.e("ALARM_DEBUG", "Notification Fired with FullScreenIntent!");
                
            } catch (Exception e) {
                android.util.Log.e("ALARM_DEBUG", "FATAL CRASH IN JAVA: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            android.util.Log.e("ALARM_DEBUG", "Received normal push, skipping alarm logic.");
        }
    }
}
