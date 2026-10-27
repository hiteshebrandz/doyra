import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ritualoop",
    short_name: "Ritualoop",
    description: "Plan it. Do it. Repeat.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#0D0D0D",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
