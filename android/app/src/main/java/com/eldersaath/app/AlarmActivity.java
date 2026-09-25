package com.eldersaath.app;

import android.app.Activity;
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

public class AlarmActivity extends Activity {
    private Ringtone ringtone;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Turn on screen and bypass lockguard
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }

        // Build a simple red full-screen UI programmatically to avoid XML layouts
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.RED);
        layout.setGravity(Gravity.CENTER);

        TextView title = new TextView(this);
        String label = getIntent().getStringExtra("label");
        title.setText(label != null ? label : "EMERGENCY ALARM!");
        title.setTextSize(36);
        title.setTextColor(Color.WHITE);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, 150);

        Button stopBtn = new Button(this);
        stopBtn.setText("STOP ALARM");
        stopBtn.setTextSize(28);
        stopBtn.setBackgroundColor(Color.WHITE);
        stopBtn.setTextColor(Color.RED);
        stopBtn.setPadding(40, 40, 40, 40);
        stopBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ringtone != null) ringtone.stop();
                finish();
            }
        });

        layout.addView(title);
        layout.addView(stopBtn);
        setContentView(layout);

        // Play native system alarm sound loudly
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
