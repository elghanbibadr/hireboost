import dynamic from 'next/dynamic';
import Navbar from "@/components/navbar";
import { Hero } from "@/components/hero";
import { createClient } from "@/lib/supabase/server";

// Dynamic imports for elements beneath the fold
const SocialProofTicker = dynamic(() => import("@/components/socialProofTicker").then(mod => mod.SocialProofTicker), { ssr: true });
const Features = dynamic(() => import("@/components/features").then(mod => mod.Features));
const HowItWorks = dynamic(() => import("@/components/howItWorks"));
const Pricing = dynamic(() => import("@/components/pricing"));
const Cta = dynamic(() => import("@/components/cta"));
const Footer = dynamic(() => import("@/components/footer").then(mod => mod.Footer));

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email || "Guest";
  
  return (
    // Wrap with your missing main landmark to clear the accessibility flag
    <main className="min-h-screen bg-slate-50 antialiased">
      <Navbar user={user} />
      <Hero userName={userName} />
      <SocialProofTicker />
      <Features />
      <HowItWorks />
      <Pricing user={{ userName }} />
      <Cta />
      <Footer />
    </main>
  );
}