

import Navbar from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SocialProofTicker } from "@/components/socialProofTicker";
import { Features } from "@/components/features";
import HowItWorks from "@/components/howItWorks";
import Pricing from "@/components/pricing";
import { Footer } from "@/components/footer";
import Cta from "@/components/cta";
import { createClient } from "@/lib/supabase/server";

// ── Main page ─────────────────────────────────────────────────────────────────
 export default async function Home() {
  const supabase =await  createClient();
const { data: { user } } = await supabase.auth.getUser();
   console.log("user",user)

const userName = user?.user_metadata?.full_name || user?.email || "Guest" 
  return (
    <>
      <Navbar user={user} />
      <Hero userName={userName} />


      {/* ── SOCIAL PROOF TICKER ────────────────────────────────────────────── */}
      <SocialProofTicker />
      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <Features />
      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <Pricing user={{ userName }} />

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <Cta />
      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
