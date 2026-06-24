"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";


interface ChartDataPoint {
  name: string;  
  score: number;
}
export function scoreColor(n: number) {
  if (n >= 75) return "#C8FF5E"; // Neon Green
  if (n >= 50) return "#ca8a04"; // Gold/Amber
  return "#ef4444"; // Red
}


const DashboardChart = ({chartData}:{chartData: ChartDataPoint[]}) => {
  return (
    <div>
        <div
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "24px",
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            Score history
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            Last {chartData.length} analyses
          </p>
        </div>
        {chartData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)", radius: 8 }}
                contentStyle={{
                  background: "#161616",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={scoreColor(entry.score)}
                    fillOpacity={0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border border-dashed border-white/10 rounded-xl">
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
              Run at least 2 analyses to see your score trend.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardChart