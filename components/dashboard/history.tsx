"use client"

import {
  FileText,
  Clock,
  ChevronRight,
 
  Plus,
} from "lucide-react";
import { Analysis } from '@/app/dashboard/page';
import Link from 'next/link';

export function scoreLabel(n: number) {
  if (n >= 75) return "Strong";
  if (n >= 50) return "Moderate";
  return "Weak";
}

function scoreColor(n: number) {
  if (n >= 75) return "#C8FF5E"; // Neon Green
  if (n >= 50) return "#ca8a04"; // Gold/Amber
  return "#ef4444"; // Red
}



const History = ({ analyses }: { analyses: Analysis[] }) => {
  return (
           <div>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            Recent analyses*
          </h2>
          {analyses && analyses?.length > 5 && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              Showing latest 20
            </p>
          )}
        </div>

        {analyses?.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-white/10 rounded-[24px]">
            <FileText
              className="h-10 w-10 mx-auto mb-4"
              style={{ color: "rgba(255,255,255,0.1)" }}
            />
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 20,
              }}
            >
              No analyses? yet — upload your first resume to get started.
            </p>
            <Link
              href="/dashboard/analyze"
              style={{
                background: "#C8FF5E",
                color: "#000",
                fontWeight: 700,
                padding: "10px 24px",
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Plus className="h-4 w-4" /> Analyze a resume
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses?.map((a) => (
              <div
                key={a.id}
                className="group p-4 flex items-center gap-4 transition-all cursor-pointer"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(200,255,94,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${scoreColor(a.score)}40`,
                    color: scoreColor(a.score),
                  }}
                >
                  {a.score}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {a.resume_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock
                      className="h-3 w-3"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    />
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      {new Date(a.created_at).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </p>
                    <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: scoreColor(a.score),
                      }}
                    >
                      {scoreLabel(a.score)}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                />
              </div>
            ))}
          </div>
        )}
      </div> 

  )
}

export default History