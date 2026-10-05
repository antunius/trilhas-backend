import {
  loadCourseBankManifest,
  loadGateBank,
  type GateTrack,
} from "@/lib/load-gate-bank";
import type { GateQuestion } from "@/lib/gates";

const COURSE_CATEGORIES = [
  "system-design",
  "code",
  "behavioral",
  "ai-coding",
  "ml-system-design",
] as const;

function dedupe(qs: GateQuestion[]): GateQuestion[] {
  const seen = new Set<string>();
  const out: GateQuestion[] = [];
  for (const q of qs) {
    const k = q.q.trim().toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  return out;
}

function banksForCategory(
  categorySlug: string,
): { track: GateTrack; slug: string }[] {
  if ((COURSE_CATEGORIES as readonly string[]).includes(categorySlug)) {
    return loadCourseBankManifest(categorySlug).map((slug) => ({
      track: categorySlug as GateTrack,
      slug,
    }));
  }
  return [];
}

export function questionsForCategory(
  categorySlug: string,
  limit = 5,
): GateQuestion[] {
  const banks = banksForCategory(categorySlug);
  const all: GateQuestion[] = [];
  for (const b of banks) {
    all.push(...loadGateBank(b.track, b.slug));
  }
  return dedupe(all).slice(0, limit);
}

export function quizCountForCategory(categorySlug: string): number {
  return questionsForCategory(categorySlug, 5).length;
}
