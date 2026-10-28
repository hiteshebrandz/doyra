package com.doyrai.app;

import android.content.Context;
import android.content.Intent;

import androidx.core.content.ContextCompat;

/** Starts and stops the looping reminder buzz. Called from the notification plugin. */
public final class ReminderBuzz {
    private ReminderBuzz() {}

    public static void start(Context context, int id, String title, String body) {
        Intent intent = new Intent(context, ReminderBuzzService.class);
        intent.putExtra(ReminderBuzzService.EXTRA_ID, id);
        intent.putExtra(ReminderBuzzService.EXTRA_TITLE, title);
        intent.putExtra(ReminderBuzzService.EXTRA_BODY, body);
        ContextCompat.startForegroundService(context, intent);
    }

    public static void stop(Context context) {
        context.stopService(new Intent(context, ReminderBuzzService.class));
    }
}
