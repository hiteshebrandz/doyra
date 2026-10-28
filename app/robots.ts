import type { MetadataRoute } from "next";
import { SITE_URL, isPreviewDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The trainer API is not a page. App and sign-in routes stay crawlable
      // so their noindex tags can be read.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
