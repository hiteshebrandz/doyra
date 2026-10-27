import type { CapacitorConfig } from "@capacitor/cli";
import { existsSync, readFileSync } from "node:fs";

function envValue(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  for (const file of [".env.local", ".env.production", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1 || trimmed.slice(0, eq) !== name) continue;
      return trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return undefined;
}

const serverUrl = envValue("NEXT_PUBLIC_APP_URL");

const config: CapacitorConfig = {
  appId: "com.doyrai.app",
  appName: "Ritualoop",
  webDir: "capacitor-web",
  backgroundColor: "#0D0D0D",
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: serverUrl.startsWith("http://"),
          allowNavigation: [
            "accounts.google.com",
            "*.google.com",
            "*.firebaseapp.com",
            "*.web.app",
          ],
        },
      }
    : {}),
};

export default config;
