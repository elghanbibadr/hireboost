"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import Navbar from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SocialProofTicker } from "@/components/socialProofTicker";
import { Features } from "@/components/features";
import HowItWorks from "@/components/howItWorks";
import Pricing from "@/components/pricing";
import { Footer } from "@/components/footer";
import Cta from "@/components/cta";

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null,
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user)
        setUser({
          email: user.email ?? "",
          name: user.user_metadata?.full_name ?? "",
        });
    });
  }, [supabase]);

  return (
    <>
      <Navbar user={user} />
      <Hero user={{ userName: user?.name ?? "" }} />

      {/* ── SOCIAL PROOF TICKER ────────────────────────────────────────────── */}
      <SocialProofTicker />
      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <Features />
      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <Pricing user={{ userName: user?.name ?? "" }} />

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <Cta />
      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
