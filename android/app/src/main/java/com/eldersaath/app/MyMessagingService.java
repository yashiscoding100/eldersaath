package com.eldersaath.app;

import com.google.firebase.messaging.RemoteMessage;
import android.content.Intent;
import com.capacitorjs.plugins.pushnotifications.MessagingService;

public class MyMessagingService extends MessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        
        if (remoteMessage.getData().size() > 0 && "ALARM".equals(remoteMessage.getData().get("type"))) {
            Intent alarmIntent = new Intent(this, AlarmActivity.class);
            alarmIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            
            String label = remoteMessage.getData().get("label");
            if (label == null) label = "EMERGENCY ALARM";
            alarmIntent.putExtra("label", label);
            
            try {
                startActivity(alarmIntent);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
