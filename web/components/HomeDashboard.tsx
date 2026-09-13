"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Layers,
  Terminal,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Compass,
} from "lucide-react";
import {
  getOverallStats,
  isProgressHydrated,
  type OverallStats,
} from "@/lib/progress";
import { ProgressRadar } from "@/components/ProgressRadar";
import { TrackLogo } from "@/components/TrackLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const TRACK_DETAILS: Record<
  string,
  {
    eyebrow: string;
    topics: string[];
    accentColor: string;
    borderHover: string;
    iconBg: string;
    iconColor: string;
    progressBarColor: string;
  }
> = {
  kafka: {
    eyebrow: "Trilha 04 · Tech Lead Backend",
    topics: [
      "Log Imutável",
      "Partições & ISR",
      "Garantias (acks=all)",
      "Outbox Pattern",
      "Spring Kafka",
      "Simulador",
    ],
    accentColor: "text-amber-400",
    borderHover: "hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    progressBarColor: "[&>div]:bg-amber-400",
  },
  arquitetura: {
    eyebrow: "Trilha 07 · Arquiteto de Software",
    topics: [
      "System Design",
      "Latência p99",
      "Cache & Inconsistência",
      "Resiliência",
      "Decomposição",
      "Nível Staff",
    ],
    accentColor: "text-indigo-400",
    borderHover: "hover:border-indigo-500/50",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-400",
    progressBarColor: "[&>div]:bg-indigo-400",
  },
};

const RADAR_LABELS: Record<string, string> = {
  "K: Base": "Kafka · Modelo Mental & Eventos",
  "K: Core": "Kafka · Partições, Grupos & Brokers",
  "K: Lab": "Kafka · Spring, Outbox & Prática",
  "A: Base": "Arquitetura · Mapa & Fundamentos",
  "A: Core": "Arquitetura · Escala, Resiliência & Dados",
  "A: Sys": "Arquitetura · System Design & Nível Staff",
};

export function HomeDashboard() {
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

  const totalArticles = stats
    ? stats.tracks.reduce((sum, t) => sum + t.articleCount, 0)
    : 36;
  const questionsAnswered = stats ? stats.questionsAnswered : 0;
  const avgMastery = stats ? stats.avgMastery : 0;
  const startHref = stats?.firstPending || "/kafka/fundamentos";

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="home-hero relative overflow-hidden">
        <div
          className="grid-lines"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />
        <div className="home-hero-blob" aria-hidden="true" />
        <div className="home-hero-inner relative z-10 max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-mono border-primary/30 bg-primary/10 text-primary gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span>Plataforma Interativa de Engenharia</span>
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight font-heading leading-tight">
            Estude arquitetura de software
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-300 to-indigo-500">
              como um engenheiro escala sistemas.
            </span>
          </h1>

          <p className="lead max-w-2xl mx-auto text-muted-foreground mt-4 text-base sm:text-lg">
            Conteúdo denso, blocos de código interativos e perguntas que
            validam seu julgamento técnico — do Apache Kafka ao System Design.
          </p>

          <div className="home-ctas flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button
              asChild
              size="lg"
              className="syntax-glow gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 h-12"
            >
              <Link href={startHref}>
                <span>Começar a estudar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 border-border/80 hover:bg-secondary/60 h-12 px-6"
            >
              <Link href="/progress">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Painel de progresso</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Continue Banner */}
        {stats?.lastPath ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold block text-sm">
                  Continuar de onde parou:
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {stats.lastPath}
                </span>
              </div>
            </div>
            <Button asChild size="sm" className="gap-2 shrink-0 bg-primary hover:bg-primary/90 text-xs">
              <Link href={stats.lastPath}>
                <span>Retomar lição</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        ) : null}

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Layers className="w-5 h-5" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-12 mb-1" />
            ) : (
              <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {stats?.tracks.length || 2}
              </div>
            )}
            <div className="text-xs text-muted-foreground font-medium">
              Trilhas ativas
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-12 mb-1" />
            ) : (
              <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {totalArticles}
              </div>
            )}
            <div className="text-xs text-muted-foreground font-medium">
              Aulas estruturadas
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-12 mb-1" />
            ) : (
              <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {questionsAnswered}
              </div>
            )}
            <div className="text-xs text-muted-foreground font-medium">
              Perguntas respondidas
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
              <Award className="w-5 h-5" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {avgMastery}%
              </div>
            )}
            <div className="text-xs text-muted-foreground font-medium">
              Domínio geral
            </div>
          </div>
        </div>

        {/* Section: Trilhas Disponíveis */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Currículo de Formação</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
                Trilhas Disponíveis
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Aprenda a arquitetar, operar e depurar sistemas de alta escala com simuladores práticos.
              </p>
            </div>
          </div>

          {/* Track Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(stats?.tracks || []).map((track) => {
              const isKafka = track.id === "kafka";
              const meta = TRACK_DETAILS[track.id] || {
                eyebrow: "Trilha Especializada",
                topics: [],
                accentColor: "text-primary",
                borderHover: "hover:border-primary/50",
                iconBg: "bg-primary/10 border-primary/20",
                iconColor: "text-primary",
                progressBarColor: "[&>div]:bg-primary",
              };

              const isCompleted = track.pct === 100;
              const isStarted = track.pct > 0;

              return (
                <div
                  key={track.id}
                  className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border/80 ${meta.borderHover} transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5`}
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${meta.iconBg} ${meta.iconColor}`}
                        >
                          <TrackLogo
                            track={isKafka ? "kafka" : "arquitetura"}
                            className="w-5 h-5"
                          />
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono tracking-wider uppercase border-border/60 text-muted-foreground"
                          >
                            {meta.eyebrow}
                          </Badge>
                          <h3 className="text-xl font-bold font-heading text-foreground mt-0.5 group-hover:text-primary transition-colors">
                            {track.name}
                          </h3>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className="text-xs font-mono font-medium px-2.5 py-1 shrink-0"
                      >
                        {track.articleCount} aulas
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {track.description}
                    </p>

                    {/* Topics Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {meta.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary/60 text-muted-foreground border border-border/40"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Action Bottom */}
                  <div className="pt-6 mt-6 border-t border-border/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">
                        {isCompleted
                          ? "Trilha concluída"
                          : isStarted
                          ? `${track.done} de ${track.total} aulas concluídas`
                          : `Não iniciada · 0 de ${track.total} aulas`}
                      </span>
                      <span className={`font-semibold ${meta.accentColor}`}>
                        {track.pct}%
                      </span>
                    </div>

                    <Progress
                      value={track.pct}
                      className={`h-2 bg-secondary ${meta.progressBarColor}`}
                    />

                    <div className="pt-2 flex justify-end">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-xs font-medium text-foreground hover:text-primary group-hover:translate-x-0.5 transition-transform"
                      >
                        <Link href={track.href}>
                          <span>
                            {isStarted ? "Continuar trilha" : "Acessar trilha"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Matriz de Competências (Radar) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Avaliação de Domínio</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-foreground">
                Matriz de Competências
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Mapeamento multidimensional de proficiência calculado com base nas perguntas dos simuladores.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-2 text-xs shrink-0">
              <Link href="/progress">
                <span>Relatório completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Radar SVG */}
            <div className="lg:col-span-5 flex items-center justify-center">
              {stats && stats.radarData.length > 0 ? (
                <div className="w-full max-w-[320px]">
                  <ProgressRadar data={stats.radarData} />
                </div>
              ) : (
                <div className="h-60 flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
                  <Skeleton className="h-40 w-40 rounded-full" />
                  <span>Carregando dados de progresso…</span>
                </div>
              )}
            </div>

            {/* Right: Competency breakdown bars */}
            <div className="lg:col-span-7 space-y-3.5">
              {(stats?.radarData || []).map((item) => {
                const label = RADAR_LABELS[item.category] || item.category;
                const isKafkaItem = item.category.startsWith("K:");

                return (
                  <div
                    key={item.category}
                    className="p-3 rounded-lg bg-secondary/30 border border-border/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {label}
                      </span>
                      <span className="font-mono text-muted-foreground font-semibold">
                        {item.score}%
                      </span>
                    </div>
                    <Progress
                      value={item.score}
                      className={`h-1.5 ${
                        isKafkaItem
                          ? "[&>div]:bg-amber-400"
                          : "[&>div]:bg-indigo-400"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-8 pb-4 border-t border-border/60">
          Next.js · Vercel · Trilhas Apache Kafka & Arquitetura de Software · Design System Obsidian Compiler
        </footer>
      </div>
    </div>
  );
}
