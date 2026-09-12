import {
  gatedPaths,
  isSimuladorPath,
  isTrackHome,
  kafkaNav,
  arquiteturaNav,
  sidebarTracks,
  type NavItem,
} from "./catalog";
import { isDevBypass } from "@/lib/dev";
import { createClient } from "@/lib/supabase/client";

export type GateRecord = { passed: true; at: number };

export type SimuladorState = { a: Record<string, number>; i: number };

export type ProgressState = {
  visited: string[];
  lastPath?: string;
  quiz?: Record<string, number>;
  gates?: Record<string, GateRecord>;
  sessions?: Record<string, boolean[]>;
  simulador?: Record<string, SimuladorState>;
};

type ProgressRow = {
  user_id: string;
  visited: string[] | null;
  last_path: string | null;
  gates: ProgressState["gates"] | null;
  quiz: ProgressState["quiz"] | null;
  sessions: ProgressState["sessions"] | null;
  simulador: ProgressState["simulador"] | null;
};

let cache: ProgressState = emptyProgress();
let userId: string | null = null;
let hydrated = false;
let persistTimer: ReturnType<typeof setTimeout> | undefined;

export function emptyProgress(): ProgressState {
  return { visited: [], quiz: {}, gates: {}, sessions: {}, simulador: {} };
}

export function isProgressHydrated() {
  return hydrated;
}

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("trilhas-progress"));
  }
}

function rowToState(row: ProgressRow | null): ProgressState {
  if (!row) return emptyProgress();
  return {
    visited: Array.isArray(row.visited) ? row.visited : [],
    lastPath: row.last_path ?? undefined,
    quiz: row.quiz && typeof row.quiz === "object" ? row.quiz : {},
    gates: row.gates && typeof row.gates === "object" ? row.gates : {},
    sessions:
      row.sessions && typeof row.sessions === "object" ? row.sessions : {},
    simulador:
      row.simulador && typeof row.simulador === "object" ? row.simulador : {},
  };
}

async function flush() {
  if (!userId || !hydrated) return;
  const supabase = createClient();
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      visited: cache.visited,
      last_path: cache.lastPath ?? null,
      gates: cache.gates ?? {},
      quiz: cache.quiz ?? {},
      sessions: cache.sessions ?? {},
      simulador: cache.simulador ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("Falha ao gravar progresso", error.message);
}

function persistSoon() {
  if (typeof window === "undefined") return;
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    void flush();
  }, 400);
}

export function loadProgress(): ProgressState {
  return cache;
}

export function saveProgress(state: ProgressState) {
  cache = state;
  emit();
  persistSoon();
}

export async function hydrateProgressFromServer(uid: string, row: ProgressRow | null) {
  userId = uid;
  cache = rowToState(row);
  hydrated = true;
  emit();
}

export function hydrateLocalDev() {
  userId = null;
  cache = emptyProgress();
  hydrated = true;
  emit();
}

export function clearProgressCache() {
  cache = emptyProgress();
  userId = null;
  hydrated = false;
  emit();
}

export async function flushProgress() {
  clearTimeout(persistTimer);
  await flush();
}

export function markVisited(path: string) {
  if (!hydrated) return;
  const state = loadProgress();
  if (!state.visited.includes(path)) state.visited.push(path);
  state.lastPath = path;
  saveProgress(state);
}

export function passedPaths(state: ProgressState = loadProgress()): Set<string> {
  return new Set(
    Object.entries(state.gates || {})
      .filter(([, g]) => g && g.passed)
      .map(([p]) => p),
  );
}

export function markGatePassed(path: string) {
  const state = loadProgress();
  state.gates = { ...state.gates, [path]: { passed: true, at: Date.now() } };
  saveProgress(state);
}

export function isLessonUnlocked(
  nav: NavItem[],
  path: string,
  passed: Set<string> = passedPaths(),
): boolean {
  if (isDevBypass()) return true;
  if (path === "/" || isTrackHome(path)) return true;
  const gated = gatedPaths(nav);
  if (isSimuladorPath(path)) {
    const last = gated[gated.length - 1];
    return Boolean(last && passed.has(last));
  }
  const i = gated.indexOf(path);
  if (i === -1) return true;
  if (i === 0) return true;
  return gated.slice(0, i).every((p) => passed.has(p));
}

export function firstPendingPath(
  nav: NavItem[],
  passed: Set<string> = passedPaths(),
): string | undefined {
  return gatedPaths(nav).find((p) => !passed.has(p));
}

export function trackProgress(_trackPrefix: string, paths: string[]) {
  const state = loadProgress();
  const passed = passedPaths(state);
  const gated = paths.filter((p) => !isTrackHome(p) && !isSimuladorPath(p));
  const total = gated.length || 1;
  const done = gated.filter((p) => passed.has(p)).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export type OverallStats = {
  questionsAnswered: number;
  questionsMastered: number;
  sessionsCompleted: number;
  avgMastery: number;
  lastPath?: string;
  firstPending: string;
  radarData: { category: string; score: number }[];
  tracks: {
    id: "kafka" | "arquitetura";
    name: string;
    description: string;
    href: string;
    articleCount: number;
    done: number;
    total: number;
    pct: number;
  }[];
};

export function getOverallStats(): OverallStats {
  const state = loadProgress();
  const passed = passedPaths(state);

  const kafkaPaths = kafkaNav.map((n) => n.href);
  const arqPaths = arquiteturaNav.map((n) => n.href);

  const kafka = trackProgress("/kafka", kafkaPaths);
  const arq = trackProgress("/arquitetura", arqPaths);

  const quizCount = Object.keys(state.quiz || {}).length;
  const simCount = Object.values(state.simulador || {}).reduce(
    (acc, s) => acc + (s && s.a ? Object.keys(s.a).length : 0),
    0,
  );
  const gatesCount = Object.keys(state.gates || {}).length;
  const questionsAnswered = Math.max(quizCount + simCount, gatesCount * 5);
  const questionsMastered = gatesCount * 4 + Math.round(quizCount * 0.8);

  const sessionsCompleted = Object.values(state.sessions || {}).reduce(
    (acc, arr) =>
      acc + (Array.isArray(arr) ? arr.filter(Boolean).length : 0),
    0,
  );

  const avgMastery = Math.round((kafka.pct + arq.pct) / 2);

  const allNav = [...kafkaNav, ...arquiteturaNav];
  const firstPending =
    firstPendingPath(allNav, passed) || "/kafka/modelo-mental";

  const kafkaTrack = sidebarTracks.find((t) => t.id === "kafka");
  const arqTrack = sidebarTracks.find((t) => t.id === "arquitetura");

  function groupPct(items: NavItem[]) {
    const gated = items.filter(
      (i) => !isTrackHome(i.href) && !isSimuladorPath(i.href),
    );
    if (gated.length === 0) return 0;
    const done = gated.filter((i) => passed.has(i.href)).length;
    return Math.round((done / gated.length) * 100);
  }

  const radarData = [
    { category: "K: Base", score: groupPct(kafkaTrack?.groups[0]?.items ?? []) },
    { category: "K: Core", score: groupPct(kafkaTrack?.groups[1]?.items ?? []) },
    { category: "K: Lab", score: groupPct(kafkaTrack?.groups[2]?.items ?? []) },
    { category: "A: Base", score: groupPct(arqTrack?.groups[0]?.items ?? []) },
    { category: "A: Core", score: groupPct(arqTrack?.groups[1]?.items ?? []) },
    { category: "A: Sys", score: groupPct(arqTrack?.groups[2]?.items ?? []) },
  ];

  const tracks = [
    {
      id: "kafka" as const,
      name: "Apache Kafka",
      description:
        "Caderno infinito, partições, replicação, outbox pattern e simulador.",
      href: "/kafka",
      articleCount: kafkaNav.filter(
        (n) => !isTrackHome(n.href) && !isSimuladorPath(n.href),
      ).length,
      done: kafka.done,
      total: kafka.total,
      pct: kafka.pct,
    },
    {
      id: "arquitetura" as const,
      name: "Arquitetura de Software",
      description:
        "Fundamentos, escalabilidade, resiliência, system design e nível Staff.",
      href: "/arquitetura",
      articleCount: arquiteturaNav.filter(
        (n) => !isTrackHome(n.href) && !isSimuladorPath(n.href),
      ).length,
      done: arq.done,
      total: arq.total,
      pct: arq.pct,
    },
  ];

  return {
    questionsAnswered,
    questionsMastered,
    sessionsCompleted,
    avgMastery,
    lastPath: state.lastPath,
    firstPending,
    radarData,
    tracks,
  };
}
