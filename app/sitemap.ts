import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** The homepage is the only indexable URL. Account pages are noindex. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
