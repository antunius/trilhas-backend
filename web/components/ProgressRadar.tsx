"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type RadarPoint = { category: string; score: number };

export function ProgressRadar({ data }: { data: RadarPoint[] }) {
  if (data.length < 3) return null;

  return (
    <div className="radar-wrap">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="category"
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
            }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{
              fill: "hsl(var(--muted-foreground) / 0.5)",
              fontSize: 9,
            }}
            axisLine={false}
          />
          <Radar
            name="Mastery"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
