package com.eldersaath.app;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Build;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.Button;
import android.view.View;
import android.graphics.Color;
import android.widget.LinearLayout;
import android.view.Gravity;
import android.media.RingtoneManager;
import android.media.Ringtone;
import android.net.Uri;
import android.widget.Toast;

public class AlarmActivity extends Activity {
    private Ringtone ringtone;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.RED);
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(60, 60, 60, 60);

        String label = getIntent().getStringExtra("label");
        if (label == null) label = "EMERGENCY ALARM!";
        
        String body = getIntent().getStringExtra("body");
        if (body == null) body = "If you don't want to take your medicine right now, snooze it and take it after 5 mins.";

        TextView titleView = new TextView(this);
        titleView.setText(label);
        titleView.setTextSize(36);
        titleView.setTextColor(Color.WHITE);
        titleView.setGravity(Gravity.CENTER);
        titleView.setPadding(0, 0, 0, 30);

        TextView bodyView = new TextView(this);
        bodyView.setText(body);
        bodyView.setTextSize(20);
        bodyView.setTextColor(Color.WHITE);
        bodyView.setGravity(Gravity.CENTER);
        bodyView.setPadding(0, 0, 0, 100);

        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        btnParams.setMargins(0, 0, 0, 40);

        Button stopBtn = new Button(this);
        stopBtn.setText("STOP ALARM");
        stopBtn.setTextSize(24);
        stopBtn.setBackgroundColor(Color.WHITE);
        stopBtn.setTextColor(Color.RED);
        stopBtn.setPadding(40, 40, 40, 40);
        stopBtn.setLayoutParams(btnParams);

        stopBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ringtone != null) ringtone.stop();
                finish();
            }
        });

        Button snoozeBtn = new Button(this);
        snoozeBtn.setText("SNOOZE (5 MINS)");
        snoozeBtn.setTextSize(20);
        snoozeBtn.setBackgroundColor(Color.DKGRAY);
        snoozeBtn.setTextColor(Color.WHITE);
        snoozeBtn.setPadding(40, 40, 40, 40);
        snoozeBtn.setLayoutParams(btnParams);

        final String finalLabel = label;
        final String finalBody = body;
        
        snoozeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ringtone != null) ringtone.stop();
                
                Intent snoozeIntent = new Intent(AlarmActivity.this, AlarmActivity.class);
                snoozeIntent.putExtra("label", finalLabel);
                snoozeIntent.putExtra("body", finalBody);
                snoozeIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                
                int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    flags |= PendingIntent.FLAG_IMMUTABLE;
                }
                
                PendingIntent pendingIntent = PendingIntent.getActivity(
                    AlarmActivity.this, 
                    (int)System.currentTimeMillis(), 
                    snoozeIntent, 
                    flags
                );
                
                AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
                long snoozeTime = System.currentTimeMillis() + (5 * 60 * 1000); // 5 mins later
                
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, snoozeTime, pendingIntent);
                    } else {
                        alarmManager.setExact(AlarmManager.RTC_WAKEUP, snoozeTime, pendingIntent);
                    }
                    Toast.makeText(AlarmActivity.this, "Snoozed! Waking you up again in 5 mins.", Toast.LENGTH_LONG).show();
                } catch (SecurityException e) {
                    // Fallback if EXACT alarm permission is denied
                    alarmManager.set(AlarmManager.RTC_WAKEUP, snoozeTime, pendingIntent);
                    Toast.makeText(AlarmActivity.this, "Snoozed for 5 mins.", Toast.LENGTH_LONG).show();
                }

                finish();
            }
        });

        layout.addView(titleView);
        layout.addView(bodyView);
        layout.addView(stopBtn);
        layout.addView(snoozeBtn);
        setContentView(layout);

        try {
            Uri alarm = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            ringtone = RingtoneManager.getRingtone(getApplicationContext(), alarm);
            ringtone.play();
        } catch (Exception e) {}
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (ringtone != null) ringtone.stop();
    }
}
