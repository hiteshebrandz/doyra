import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Android emulator reaches this machine as 10.0.2.2.
  allowedDevOrigins: ["10.0.2.2"],
};

export default nextConfig;
