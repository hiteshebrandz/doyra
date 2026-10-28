"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthSplash } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { Hero } from "./Hero";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const HowItWorks = dynamic(() => import("./HowItWorks").then((m) => m.HowItWorks));
const FeatureDeep = dynamic(() => import("./FeatureDeep").then((m) => m.FeatureDeep));
const Install = dynamic(() => import("./Install").then((m) => m.Install));
const Faq = dynamic(() => import("./Faq").then((m) => m.Faq));

export function HomeScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  // Auth starts in a loading state, so hiding the page until it resolves
  // would send crawlers only the splash. Redirect after a session is known.
  if (!loading && user) return <AuthSplash />;

  return (
    <div className="min-h-[100dvh]">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <FeatureDeep />
        <Install />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
