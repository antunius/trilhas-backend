"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  RotateCcw,
  TrendingUp,
  Zap,
  Boxes,
  Sparkles,
  Compass,
} from "lucide-react";
import {
  getOverallStats,
  isProgressHydrated,
  type OverallStats,
} from "@/lib/progress";
import { ProgressRadar } from "@/components/ProgressRadar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function ProgressView() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function sync() {
      if (!isProgressHydrated()) return;
      setStats(getOverallStats());
      setLoading(false);
    }
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, []);

  const totalStudied = stats ? stats.questionsAnswered : 0;
  const totalMastered = stats ? stats.questionsMastered : 0;
  const totalSessions = stats ? stats.sessionsCompleted : 0;
  const avgMastery = stats ? stats.avgMastery : 0;

  return (
    <div className="wrap max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs font-mono text-primary border-primary/30 bg-primary/10 gap-1.5 px-2.5 py-0.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Painel de Aprendizado</span>
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
          Painel de Maestria e Progresso
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Acompanhe seu avanço sistemático de Engenheiro de Software até System Architect.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-12 mb-1" />
          ) : (
            <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {totalStudied}
            </div>
          )}
          <div className="text-xs text-muted-foreground font-medium">
            Perguntas respondidas
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <Award className="w-5 h-5" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-12 mb-1" />
          ) : (
            <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {totalMastered}
            </div>
          )}
          <div className="text-xs text-muted-foreground font-medium">
            Perguntas acertadas
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
            <RotateCcw className="w-5 h-5" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-12 mb-1" />
          ) : (
            <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {totalSessions}
            </div>
          )}
          <div className="text-xs text-muted-foreground font-medium">
            Sessões completas
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mb-1" />
          ) : (
            <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {avgMastery}%
            </div>
          )}
          <div className="text-xs text-muted-foreground font-medium">
            Domínio médio
          </div>
        </div>
      </div>

      {/* Radar Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Eixos de Competência</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            Visualização de Domínio Técnico
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Diagrama radar com o percentual de acerto e retenção por dimensão do currículo.
          </p>
        </div>

        {stats && stats.radarData.length > 0 ? (
          <div className="w-full max-w-[340px] mx-auto pt-2">
            <ProgressRadar data={stats.radarData} />
          </div>
        ) : (
          <div className="h-60 flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
            <Skeleton className="h-40 w-40 rounded-full" />
            <span>Sem dados ainda — estude algumas aulas e passe nos simuladores.</span>
          </div>
        )}
      </div>

      {/* Breakdown per Track */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Desempenho por Trilha</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            Status de Conclusão das Lições
          </h2>
        </div>

        <div className="grid gap-4">
          {(stats?.tracks || []).map((t) => {
            const isKafka = t.id === "kafka";
            return (
              <div
                key={t.id}
                className="p-5 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                        isKafka
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}
                      aria-hidden="true"
                    >
                      {isKafka ? <Zap className="w-5 h-5" /> : <Boxes className="w-5 h-5" />}
                    </div>
                    <div>
                      <Link
                        href={t.href}
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors block"
                      >
                        {t.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {t.done} de {t.total} aulas concluídas · {t.articleCount} aulas estruturadas
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5">
                    {t.pct}%
                  </Badge>
                </div>

                <Progress
                  value={t.pct}
                  className={`h-2 bg-secondary ${
                    isKafka ? "[&>div]:bg-amber-400" : "[&>div]:bg-indigo-400"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Return button */}
      <div className="text-center pt-4 pb-12">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>
        </Button>
      </div>

      <footer className="pt-8 border-t border-border/60 text-xs text-muted-foreground text-center">
        Next.js · Vercel · Trilhas Apache Kafka & Arquitetura de Software · Design System Obsidian Compiler
      </footer>
    </div>
  );
}
