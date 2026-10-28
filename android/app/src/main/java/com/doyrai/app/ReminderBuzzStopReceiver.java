package com.doyrai.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Stops the buzz when the reminder notification is dismissed. */
public class ReminderBuzzStopReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        ReminderBuzz.stop(context);
    }
}
