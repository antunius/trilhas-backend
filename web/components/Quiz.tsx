"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import type { GateQuestion } from "@/lib/gates";
import {
  loadProgress,
  saveProgress,
  type SimuladorState,
} from "@/lib/progress";
import { fetchSimulador, type QuizTopic } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

function empty(): SimuladorState {
  return { a: {}, i: 0 };
}

export function Quiz({ trackKey }: { trackKey: "kafka" | "arquitetura" }) {
  const [topics, setTopics] = useState<Record<string, QuizTopic>>({});
  const [questions, setQuestions] = useState<GateQuestion[]>([]);
  const [state, setState] = useState<SimuladorState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchSimulador(trackKey).then((bank) => {
      if (!alive) return;
      setTopics(bank.topics);
      setQuestions(bank.questions);
      const saved = loadProgress().simulador?.[trackKey];
      if (saved?.a && typeof saved.i === "number") setState(saved);
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, [trackKey]);

  function persist(next: SimuladorState) {
    setState(next);
    const progress = loadProgress();
    progress.simulador = { ...progress.simulador, [trackKey]: next };
    saveProgress(progress);
  }

  useEffect(() => {
    if (!hydrated || !questions.length) return;
    if (state.i < questions.length) return;
    let score = 0;
    questions.forEach((item, i) => {
      if (Number(state.a[i]) === item.a) score += 1;
    });
    const progress = loadProgress();
    if (progress.quiz?.[trackKey] !== score) {
      progress.quiz = { ...progress.quiz, [trackKey]: score };
      saveProgress(progress);
    }
  }, [hydrated, questions, state, trackKey]);

  if (!hydrated) {
    return (
      <div className="space-y-4 py-8">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <p className="quiz-meta text-muted-foreground py-8">
        Banco do simulador ainda não carregou.
      </p>
    );
  }

  const done = state.i >= questions.length;
  const answered = Object.keys(state.a).length;
  const bar = Math.round((answered / questions.length) * 100);

  if (done) {
    const byTopic: Record<string, { ok: number; total: number }> = {};
    Object.keys(topics).forEach((k) => {
      byTopic[k] = { ok: 0, total: 0 };
    });
    let score = 0;
    questions.forEach((item, i) => {
      if (!byTopic[item.t ?? ""]) byTopic[item.t ?? ""] = { ok: 0, total: 0 };
      byTopic[item.t ?? ""].total += 1;
      if (Number(state.a[i]) === item.a) {
        score += 1;
        byTopic[item.t ?? ""].ok += 1;
      }
    });
    const rows = Object.keys(topics)
      .map((k) => {
        const t = byTopic[k] ?? { ok: 0, total: 0 };
        const pct = t.total ? Math.round((t.ok / t.total) * 100) : 0;
        return { k, pct, ok: t.ok, total: t.total, gap: pct < 80 };
      })
      .sort((a, b) => a.pct - b.pct);
    const p = score / questions.length;
    let faixa =
      "Faixa fundamento: volte ao modelo mental e ao glossário. Sem o modelo, o resto é memorização.";
    if (p >= 0.9) faixa = "Faixa Lead: o modelo está no sangue. Polir o tema mais fraco e ensinar o time.";
    else if (p >= 0.75)
      faixa = "Faixa pleno forte: você aguenta a mesa. Os gaps abaixo são o que um Lead vai cutucar.";
    else if (p >= 0.55)
      faixa = "Faixa pleno em construção: vocabulário existe, julgamento ainda fura.";

    return (
      <div className="space-y-8 my-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-xs">
            {questions.length} de {questions.length} respondidas
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            100% Concluído
          </Badge>
        </div>
        <Progress value={100} className="h-1.5 bg-secondary" />

        <div className="quiz-result space-y-6">
          <div className="p-6 rounded-xl bg-card border border-primary/30 bg-primary/5 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg text-foreground">
                {score} de {questions.length} acertos ({Math.round(p * 100)}%)
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faixa}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading text-foreground">
              Mapa de Gaps por Tema
            </h3>
            <div className="space-y-3">
              {rows.map((r) => (
                <div
                  key={r.k}
                  className="p-4 rounded-xl border border-border/80 bg-card space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {topics[r.k]?.name ?? r.k}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono">
                        {r.ok}/{r.total}
                      </span>
                      <Badge
                        variant="outline"
                        className={`font-mono text-[11px] ${
                          r.gap
                            ? "border-rose-500/40 text-rose-400 bg-rose-500/10"
                            : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                        }`}
                      >
                        {r.pct}%
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={r.pct}
                    className={`h-2 ${r.gap ? "[&>div]:bg-rose-500" : "[&>div]:bg-emerald-500"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {rows.some((r) => r.gap) ? (
            <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-foreground">
                  Plano de estudo recomendado (pior primeiro)
                </h4>
              </div>
              <ul className="gap-list space-y-2 text-xs sm:text-sm text-muted-foreground">
                {rows
                  .filter((r) => r.gap)
                  .map((r) => (
                    <li key={r.k} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      <span>
                        <Link
                          href={topics[r.k]?.href ?? "#"}
                          className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
                        >
                          {topics[r.k]?.name ?? r.k}
                        </Link>{" "}
                        — {r.ok}/{r.total} ({r.pct}%). Abaixo de 80% é onde a mesa de entrevista aprofunda.
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-sm text-emerald-300">
                Parabéns! Nenhum tema ficou abaixo de 80%. Desenhe a arquitetura de memória e pratique explicar um caso real de escala para o time.
              </p>
            </div>
          )}
        </div>

        <div className="quiz-actions pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => persist(empty())}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recomeçar simulador</span>
          </Button>
        </div>
      </div>
    );
  }

  const item = questions[state.i];
  const topic = item.t ? topics[item.t] : undefined;
  const chosen = state.a[state.i];

  return (
    <div className="space-y-6 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            Questão {state.i + 1} de {questions.length}
          </Badge>
          {topic?.name ? (
            <Badge variant="secondary" className="text-xs">
              {topic.name}
            </Badge>
          ) : null}
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Progresso salvo automaticamente
        </span>
      </div>

      <Progress value={bar} className="h-1.5 bg-secondary" />

      <article className="p-6 rounded-xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="text-xs font-mono text-primary uppercase tracking-wider">
          Pergunta {state.i + 1}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
          {item.q}
        </h3>

        <div className="opts space-y-2.5 pt-2">
          {item.o.map((text, j) => {
            const isPicked = chosen === j;
            return (
              <button
                type="button"
                key={j}
                onClick={() => {
                  persist({
                    a: { ...state.a, [state.i]: j },
                    i: state.i + 1,
                  });
                }}
                className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-start gap-3 ${
                  isPicked
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border hover:border-primary/40 hover:bg-secondary/40 text-foreground"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 ${
                    isPicked
                      ? "border-2 border-primary bg-primary"
                      : "border-border"
                  }`}
                />
                <span className="leading-relaxed flex-1">{text}</span>
              </button>
            );
          })}
        </div>
      </article>

      <div className="quiz-actions flex items-center justify-between pt-2">
        {state.i > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => persist({ ...state, i: state.i - 1 })}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Questão anterior</span>
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => persist(empty())}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Recomeçar</span>
        </Button>
      </div>
    </div>
  );
}
