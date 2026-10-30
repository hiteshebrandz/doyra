"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { isNativeApp } from "@/lib/native-app";

/** Asks once each time the installed app opens, then saves that fix. */
export function LocationCapture() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !isNativeApp()) return;
    let cancelled = false;

    void (async () => {
      try {
        const { Geolocation } = await import("@capacitor/geolocation");
        const current = await Geolocation.checkPermissions();
        if (current.location !== "granted" && current.coarseLocation !== "granted") {
          const asked = await Geolocation.requestPermissions();
          if (asked.location !== "granted" && asked.coarseLocation !== "granted") return;
        }
        if (cancelled) return;
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        });
        if (cancelled) return;
        const token = await user.getIdToken();
        await fetch("/api/locations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        });
      } catch {
        // The person declined, or this open had no fix. The next open can try again.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return null;
}
