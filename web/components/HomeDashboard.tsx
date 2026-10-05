"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Zap,
  Circle,
} from "lucide-react";
import {
  getCategoryReadiness,
  getOverallStats,
  isProgressHydrated,
  type CategoryReadiness,
  type OverallStats,
} from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import articlesIndex from "@/content/articles/index.json";
import type { ArticleMeta } from "@/types/content";
import { cn } from "@/lib/utils";

const ARTICLES = articlesIndex as ArticleMeta[];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomeDashboard() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [readiness, setReadiness] = useState<CategoryReadiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    function sync() {
      if (!isProgressHydrated()) return;
      const s = getOverallStats();
      const r = getCategoryReadiness();
      setStats(s);
      setReadiness(r);
      setLoading(false);
      setOpenSlug(
        (prev) => prev ?? r.find((c) => c.pct < 100)?.slug ?? r[0]?.slug ?? null,
      );
    }
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, []);

  const startHref =
    stats?.firstPending || "/category/system-design/orientacao";
  const recent = [...ARTICLES]
    .sort(
      (a, b) =>
        a.categorySlug.localeCompare(b.categorySlug) || a.order - b.order,
    )
    .slice(-3)
    .reverse();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">
        <section className="rounded-2xl bg-primary px-8 sm:px-12 py-12 sm:py-14 text-primary-foreground">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              {greeting()}!
            </h1>
            <p className="mt-2 text-base sm:text-lg opacity-90">
              Continue o ritmo — você está no caminho certo.
            </p>
            <div className="mt-6">
              <Button
                asChild
                variant="secondary"
                className="h-10 px-5 gap-2 bg-background text-foreground hover:bg-background/90"
              >
                <Link href={startHref}>
                  Continuar estudando
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href={startHref}
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-5 hover:border-primary/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">Continuar artigo</div>
              <div className="text-sm text-muted-foreground truncate">
                {loading
                  ? "Carregando..."
                  : stats?.lastPath
                    ? "Retomar de onde parou"
                    : "Começar pelo próximo artigo pendente"}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Link>

          <Link
            href="/practice"
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-5 hover:border-primary/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">Avaliação</div>
              <div className="text-sm text-muted-foreground">
                Testar conhecimento por categoria
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Link>
        </div>

        <section className="space-y-3 pt-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Preparação por categoria
          </h2>
          {loading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            readiness.map((cat) => {
              const open = openSlug === cat.slug;
              return (
                <div
                  key={cat.slug}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSlug((s) => (s === cat.slug ? null : cat.slug))
                    }
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary/40 transition-colors"
                    aria-expanded={open}
                  >
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                        open ? "rotate-0" : "-rotate-90",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">
                        {cat.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {cat.done}/{cat.total} artigos
                        {cat.quizPct > 0 ? ` · quiz ${cat.quizPct}%` : ""}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-foreground">
                        {cat.pct}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        completo
                      </div>
                    </div>
                  </button>
                  <div className="px-5 pb-3">
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                  {open ? (
                    <ul className="border-t border-border px-3 py-2 grid sm:grid-cols-2 gap-0.5">
                      {cat.articles.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={a.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary/60 transition-colors"
                          >
                            {a.done ? (
                              <Check className="w-4 h-4 text-primary shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                            )}
                            <span
                              className={cn(
                                "flex-1 line-clamp-1",
                                a.done
                                  ? "text-muted-foreground"
                                  : "text-foreground",
                              )}
                            >
                              {a.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li className="sm:col-span-2">
                        <Link
                          href={`/category/${cat.slug}/quiz`}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary/60 transition-colors"
                        >
                          {cat.quizPct > 0 ? (
                            <Check className="w-4 h-4 text-primary shrink-0" />
                          ) : (
                            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <span className="flex-1 text-foreground">
                            Avaliação
                          </span>
                          {cat.quizPct > 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {cat.quizPct}%
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    </ul>
                  ) : null}
                </div>
              );
            })
          )}
        </section>

        <section className="pt-4 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Conteúdo em destaque
            </h2>
            <Link href="/learn" className="text-xs text-primary hover:underline">
              Ver tudo
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.map((a) => (
              <Link
                key={`${a.categorySlug}/${a.slug}`}
                href={`/category/${a.categorySlug}/${a.slug}`}
                className="block rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/40 transition-colors h-full"
              >
                <div className="text-[10px] uppercase tracking-widest text-primary mb-1">
                  {a.categorySlug.replace(/-/g, " ")}
                </div>
                <div className="font-medium text-foreground">{a.title}</div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {a.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
