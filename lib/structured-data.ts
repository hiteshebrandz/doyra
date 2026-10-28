import { HOME_FAQ } from "@/lib/home-faq";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/** JSON-LD for the public homepage. Only facts that appear on the page. */
export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/app-icon-512.png"),
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Android 7.0+, Web",
        url: SITE_URL,
        downloadUrl: absoluteUrl("/doyrai.apk"),
        description: SITE_DESCRIPTION,
        isAccessibleForFree: true,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        url: `${SITE_URL}/#faq`,
        mainEntity: HOME_FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}
