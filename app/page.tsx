import type { Metadata } from "next";
import { HomeScreen } from "@/components/home/HomeScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeStructuredData } from "@/lib/structured-data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ritualoop — Plan it. Do it. Repeat.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function LandingPage() {
  return (
    <>
      <JsonLd data={homeStructuredData()} />
      <HomeScreen />
    </>
  );
}
