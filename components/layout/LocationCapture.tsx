"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { isNativeApp } from "@/lib/native-app";
import { saveOpenedUser } from "@/lib/user-locations";

const LOCATION_INTERVAL_MS = 2 * 60 * 1000;

async function locationAllowed(): Promise<boolean> {
  const { Geolocation } = await import("@capacitor/geolocation");
  const current = await Geolocation.checkPermissions();
  if (current.location === "granted" || current.coarseLocation === "granted") return true;
  const asked = await Geolocation.requestPermissions();
  return asked.location === "granted" || asked.coarseLocation === "granted";
}

/** While the installed app stays open, save who is using it and a fresh location every 2 minutes. */
export function LocationCapture() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !isNativeApp()) return;
    let cancelled = false;
    let timer = 0;
    let saving = false;

    const saveFix = async () => {
      if (saving || cancelled) return;
      saving = true;
      try {
        const { Geolocation } = await import("@capacitor/geolocation");
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
        if (cancelled) return;
        await saveOpenedUser(user, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch {
        // This round had no fix. The next one tries again.
      } finally {
        saving = false;
      }
    };

    void (async () => {
      try {
        await saveOpenedUser(user);
      } catch {
        // The next open tries again.
      }
      if (cancelled) return;
      try {
        const allowed = await locationAllowed();
        if (!allowed || cancelled) return;
      } catch {
        return;
      }
      await saveFix();
      if (cancelled) return;
      timer = window.setInterval(() => {
        void saveFix();
      }, LOCATION_INTERVAL_MS);
    })();

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [user]);

  return null;
}
