import { createClient } from "@/lib/supabase/client";
import categoriesJson from "@/content/categories.json";
import articlesIndex from "@/content/articles/index.json";
import type { ArticleMeta, Category } from "@/types/content";

const CATEGORIES = categoriesJson as Category[];
const ARTICLES = articlesIndex as ArticleMeta[];

export type GateRecord = { passed: true; at: number };

export type SimuladorState = { a: Record<string, number>; i: number };

export type ProgressState = {
  visited: string[];
  lastPath?: string;
  quiz?: Record<string, number>;
  gates?: Record<string, GateRecord>;
  sessions?: Record<string, boolean[]>;
  /** Kept for rows already stored in Supabase; no longer written by UI. */
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

export async function hydrateProgressFromServer(
  uid: string,
  row: ProgressRow | null,
) {
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

export function markArticleRead(
  path: string,
  _categorySlug: string,
  _articleSlug: string,
) {
  if (!hydrated) return;
  const state = loadProgress();
  if (!state.visited.includes(path)) state.visited.push(path);
  state.lastPath = path;
  saveProgress(state);
}

export function markCategoryQuiz(
  categorySlug: string,
  score: number,
  total: number,
) {
  if (!hydrated) return;
  const state = loadProgress();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  state.quiz = { ...(state.quiz || {}), [`vm:${categorySlug}`]: pct };
  saveProgress(state);
}

export function categoryQuizPct(categorySlug: string): number {
  const state = loadProgress();
  const v = state.quiz?.[`vm:${categorySlug}`];
  return typeof v === "number" ? v : 0;
}

export type OverallStats = {
  questionsAnswered: number;
  questionsMastered: number;
  sessionsCompleted: number;
  avgMastery: number;
  lastPath?: string;
  firstPending: string;
  categoriesCount: number;
  articlesCount: number;
  radarData: { category: string; score: number }[];
  categories: {
    slug: string;
    name: string;
    description: string;
    href: string;
    articleCount: number;
    done: number;
    total: number;
    pct: number;
  }[];
};

function articlePath(a: ArticleMeta) {
  return `/category/${a.categorySlug}/${a.slug}`;
}

export function isArticleVisited(path: string): boolean {
  const state = loadProgress();
  return (state.visited || []).includes(path);
}

export type CategoryReadiness = {
  slug: string;
  name: string;
  description: string;
  href: string;
  pct: number;
  done: number;
  total: number;
  quizPct: number;
  articles: {
    slug: string;
    title: string;
    href: string;
    done: boolean;
  }[];
};

export function getCategoryReadiness(): CategoryReadiness[] {
  const state = loadProgress();
  const visited = new Set(state.visited || []);
  return [...CATEGORIES]
    .filter((c) => !c.stub)
    .sort((a, b) => a.order - b.order)
    .map((c) => {
      const arts = ARTICLES.filter((a) => a.categorySlug === c.slug).sort(
        (a, b) => a.order - b.order,
      );
      const m = categoryMastery(c.slug, visited);
      return {
        slug: c.slug,
        name: c.name,
        description: c.description,
        href: `/category/${c.slug}`,
        pct: m.pct,
        done: m.done,
        total: m.total,
        quizPct: categoryQuizPct(c.slug),
        articles: arts.map((a) => ({
          slug: a.slug,
          title: a.title,
          href: articlePath(a),
          done: visited.has(articlePath(a)),
        })),
      };
    });
}

function categoryMastery(
  categorySlug: string,
  visited: Set<string>,
): { done: number; total: number; pct: number } {
  const arts = ARTICLES.filter((a) => a.categorySlug === categorySlug);
  const total = Math.max(arts.length, 1);
  const done = arts.filter((a) => visited.has(articlePath(a))).length;
  const readPct = Math.round((done / total) * 100);
  const quizPct = categoryQuizPct(categorySlug);
  const pct =
    quizPct > 0 ? Math.round(readPct * 0.7 + quizPct * 0.3) : readPct;
  return { done, total: arts.length, pct };
}

export function getOverallStats(): OverallStats {
  const state = loadProgress();
  const visited = new Set(state.visited || []);

  const categories = [...CATEGORIES]
    .filter((c) => !c.stub)
    .sort((a, b) => a.order - b.order)
    .map((c) => {
      const m = categoryMastery(c.slug, visited);
      return {
        slug: c.slug,
        name: c.name,
        description: c.description,
        href: `/category/${c.slug}`,
        articleCount: m.total,
        done: m.done,
        total: m.total,
        pct: m.pct,
      };
    });

  const radarData = categories.map((c) => ({
    category: c.name.split(" ")[0] || c.name,
    score: c.pct,
  }));

  const avgMastery =
    categories.length === 0
      ? 0
      : Math.round(
          categories.reduce((acc, c) => acc + c.pct, 0) / categories.length,
        );

  const vmKeys = Object.entries(state.quiz || {}).filter(([k]) =>
    k.startsWith("vm:"),
  );
  const questionsAnswered = vmKeys.length * 5;
  const questionsMastered = Math.round(
    vmKeys.reduce((acc, [, pct]) => acc + (pct / 100) * 5, 0),
  );

  const firstUnread =
    ARTICLES.map(articlePath).find((p) => !visited.has(p)) ||
    "/category/system-design/orientacao";

  return {
    questionsAnswered,
    questionsMastered,
    sessionsCompleted: Object.values(state.sessions || {}).reduce(
      (acc, arr) =>
        acc + (Array.isArray(arr) ? arr.filter(Boolean).length : 0),
      0,
    ),
    avgMastery,
    lastPath: state.lastPath,
    firstPending: firstUnread,
    categoriesCount: categories.length,
    articlesCount: ARTICLES.length,
    radarData,
    categories,
  };
}
