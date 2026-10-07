import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Doyrai",
    short_name: "Doyrai",
    description: "Plan it. Do it. Repeat.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F8F9FF",
    theme_color: "#4648D4",
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
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
