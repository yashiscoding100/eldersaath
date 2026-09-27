package com.eldersaath.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.view.WindowManager;
import android.os.Build;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            );
        }
        
        // Ask for Display Over Other Apps permission to force alarms to take over the screen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                           Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, 1000);
            }
        }
    }
}