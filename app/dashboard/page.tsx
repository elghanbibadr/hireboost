import Link from "next/link";

import { FileText, Zap, TrendingUp, Plus, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/state-card";
import { createClient } from "@/lib/supabase/server";
import DashboardChart from "@/components/dashboard/dashboard-chart";
import History from "@/components/dashboard/history";

export interface Analysis {
  id: string;
  resume_name: string;
  score: number;
  created_at: string;
}
interface Profile {
  plan: "free" | "pro";
  credits: number;
  full_name: string;
  email: string;
}

 function scoreLabel(n: number) {
  if (n >= 75) return "Strong";
  if (n >= 50) return "Moderate";
  return "Weak";
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authenticate user on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch all data concurrently in parallel
  const [{ data: profile }, { data: analyses }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user?.id).single<Profile>(),

    supabase
      .from("analyses")
      // Pass Analysis[] here inside select so the chain knows its final type
      .select<string, Analysis>("id, resume_name, score, created_at")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  const history = analyses ?? [];

  
  const isPro = profile?.plan === "pro";
  const avgScore = analyses?.length
    ? Math.round(analyses?.reduce((s, a) => s + a.score, 0) / analyses?.length)
    : 0;
  const best = analyses?.length
    ? Math.max(...analyses?.map((a) => a.score))
    : 0;
  const creditsLeft = profile?.credits ?? 0;

  const chartData = [...(analyses ?? [])]
    .reverse()
    .slice(-10)
    .map((a) => ({
      name: new Date(a.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: a.score,
    }));

  return (
    <div className="space-y-8 fade-up-d1">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {profile?.full_name
              ? `Good to see you, ${profile.full_name.split(" ")[0]}`
              : "Overview"}
          </h1>
          <p className="text-sm text-white/40">
            Here&apos;s how your job applications are doing.
          </p>
        </div>
        <Link
          href="/dashboard/analyze"
          className="inline-flex items-center gap-2 bg-[#C8FF5E] text-black font-bold text-sm px-5 py-2.5 rounded-xl"
        >
          <Plus className="h-4 w-4" /> New Analysis
        </Link>
      </div>

      {/* Free plan nudge */}
      {!isPro && (
        <div
          className="flex items-center justify-between gap-4 p-5 rounded-[20px]"
          style={{
            background: "rgba(200,255,94,0.03)",
            border: "1px solid rgba(200,255,94,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <Sparkles
              className="h-4 w-4 shrink-0"
              style={{ color: "#C8FF5E" }}
            />
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
              <span className="font-semibold text-white">
                {creditsLeft} credit{creditsLeft !== 1 ? "s" : ""} left
              </span>{" "}
              this month. Upgrade to Pro for unlimited analyses.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            style={{ fontSize: 13, fontWeight: 700, color: "#C8FF5E" }}
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total analyses"
          value={analyses?.length ?? 0}
          icon={FileText}
          sub="All time"
        />
        <StatCard
          label="Average score"
          value={analyses?.length ? avgScore : "—"}
          icon={TrendingUp}
          sub={analyses?.length ? scoreLabel(avgScore) : "No data"}
        />
        <StatCard
          label="Best score"
          value={analyses?.length ? best : "—"}
          icon={TrendingUp}
          sub={analyses?.length ? scoreLabel(best) : undefined}
        />
        <StatCard
          label="Credits left"
          value={creditsLeft}
          icon={Zap}
          sub={isPro ? "Pro Account" : "Resets monthly"}
        />
      </div>

      {/* Chart */}
      <DashboardChart chartData={chartData} />

      {/* History */}
      <History analyses={history} />
    </div>
  );
}
