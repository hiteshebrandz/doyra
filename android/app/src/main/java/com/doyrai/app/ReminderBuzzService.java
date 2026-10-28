package com.doyrai.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;

import androidx.core.app.NotificationCompat;

/**
 * Plays a soft looping buzz and a repeating vibration until the reminder
 * notification is opened or dismissed.
 */
public class ReminderBuzzService extends Service {
    static final String EXTRA_ID = "id";
    static final String EXTRA_TITLE = "title";
    static final String EXTRA_BODY = "body";
    private static final String CHANNEL_ID = "ritualoop-reminders-v2";

    private MediaPlayer player;
    private Vibrator vibrator;
    private PowerManager.WakeLock wakeLock;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        int id = intent != null ? intent.getIntExtra(EXTRA_ID, 1) : 1;
        if (id == Integer.MIN_VALUE || id == 0) id = 1;
        String title = intent != null ? intent.getStringExtra(EXTRA_TITLE) : null;
        String body = intent != null ? intent.getStringExtra(EXTRA_BODY) : null;
        if (title == null || title.trim().isEmpty()) title = "Ritualoop";
        if (body == null || body.trim().isEmpty()) body = "Reminder";

        ensureChannel();
        Notification notification = buildNotification(id, title, body);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(id, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
            } else {
                startForeground(id, notification);
            }
        } catch (Exception error) {
            stopSelf();
            return START_NOT_STICKY;
        }

        if (player == null) {
            holdWakeLock();
            startBuzz();
            startVibration();
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        if (player != null) {
            try {
                player.stop();
            } catch (Exception ignored) {
            }
            player.release();
            player = null;
        }
        if (vibrator != null) {
            vibrator.cancel();
            vibrator = null;
        }
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        wakeLock = null;
        super.onDestroy();
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Reminders",
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("A soft buzz and vibration until you open the reminder");
        channel.enableVibration(true);
        channel.setSound(
            null,
            new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
        );
        manager.createNotificationChannel(channel);
    }

    private Notification buildNotification(int id, String title, String body) {
        Intent open = new Intent(this, MainActivity.class);
        open.setAction(Intent.ACTION_MAIN);
        open.addCategory(Intent.CATEGORY_LAUNCHER);
        open.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        open.putExtra("LocalNotificationId", id);
        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            pendingFlags |= PendingIntent.FLAG_MUTABLE;
        }
        PendingIntent content = PendingIntent.getActivity(this, id, open, pendingFlags);

        Intent dismiss = new Intent(this, ReminderBuzzStopReceiver.class);
        PendingIntent delete = PendingIntent.getBroadcast(this, id, dismiss, pendingFlags);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setOngoing(true)
            .setAutoCancel(true)
            .setSilent(true)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(content)
            .setDeleteIntent(delete)
            .build();
    }

    private void startBuzz() {
        try {
            MediaPlayer media = new MediaPlayer();
            media.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            );
            android.content.res.AssetFileDescriptor descriptor = getResources().openRawResourceFd(R.raw.soft_buzz);
            media.setDataSource(descriptor.getFileDescriptor(), descriptor.getStartOffset(), descriptor.getLength());
            descriptor.close();
            media.setLooping(true);
            media.setVolume(0.4f, 0.4f);
            media.prepare();
            media.start();
            player = media;
        } catch (Exception ignored) {
            player = null;
        }
    }

    private void startVibration() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            VibratorManager manager = (VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
            vibrator = manager != null ? manager.getDefaultVibrator() : null;
        } else {
            vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        }
        if (vibrator == null || !vibrator.hasVibrator()) return;
        long[] pattern = new long[] {0, 140, 90, 140, 860};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0));
        } else {
            vibrator.vibrate(pattern, 0);
        }
    }

    private void holdWakeLock() {
        PowerManager power = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (power == null) return;
        wakeLock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ritualoop:reminder-buzz");
        wakeLock.setReferenceCounted(false);
        wakeLock.acquire();
    }
}
