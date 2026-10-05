"use client";

import { useEffect, useState } from "react";
import { getPracticeStats, type PracticeStats } from "@/lib/progress";

/** "N de M lições · X respondidas · Y% de acerto · Z para revisar" */
export function PracticeStatsPanel({
  categorySlug,
  bankSlugs,
}: {
  categorySlug: string;
  bankSlugs: string[];
}) {
  const [stats, setStats] = useState<PracticeStats | null>(null);
  useEffect(() => {
    const sync = () => setStats(getPracticeStats(categorySlug, bankSlugs));
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, [categorySlug, bankSlugs]);

  if (!stats || bankSlugs.length === 0) return null;
  const items: [string | number, string][] = [
    [`${stats.lessonsDone} de ${stats.lessonsTotal}`, "lições"],
    [stats.answered, "respondidas"],
    [`${stats.accuracyPct}%`, "de acerto"],
    [stats.toReview, "para revisar"],
  ];
  return (
    <dl
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
      aria-label="Seu progresso no curso"
    >
      {items.map(([value, label]) => (
        <div key={label} className="rounded-xl border border-border bg-card px-4 py-3">
          <dt className="sr-only">{label}</dt>
          <dd className="text-lg font-semibold text-foreground leading-tight">
            {value}
            <span className="block text-xs font-normal text-muted-foreground mt-0.5">
              {label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
