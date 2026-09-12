"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type { Beat, ChoiceOption, LessonDoc, WidgetName } from "@/lib/beats";
import { CadernoKafka } from "@/components/CadernoKafka";
import { OutboxWalkthrough } from "@/components/OutboxWalkthrough";
import { WhenKafka } from "@/components/WhenKafka";
import { LatencyLevers } from "@/components/LatencyLevers";
import { CacheLab } from "@/components/CacheLab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const WIDGETS: Record<WidgetName, () => ReactNode> = {
  caderno: () => <CadernoKafka />,
  outbox: () => <OutboxWalkthrough />,
  "quando-kafka": () => <WhenKafka />,
  latencia: () => <LatencyLevers />,
  cache: () => <CacheLab />,
};

type Stored = {
  i: number;
  farthest: number;
  picks: Record<string, string>;
};

function storageKey(path: string) {
  return `trilhas-beat:${path}`;
}

function loadStored(path: string): Stored {
  try {
    const raw = localStorage.getItem(storageKey(path));
    if (!raw) return { i: 0, farthest: 0, picks: {} };
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed.i !== "number") return { i: 0, farthest: 0, picks: {} };
    return {
      i: parsed.i,
      farthest: parsed.farthest ?? parsed.i,
      picks: parsed.picks ?? {},
    };
  } catch {
    return { i: 0, farthest: 0, picks: {} };
  }
}

function verdictLabel(v: ChoiceOption["verdict"]) {
  if (v === "bom") return "Essa segura";
  if (v === "meio") return "Quase — falta o preço";
  return "Por aqui quebra";
}

function BeatBody({ beat, html }: { beat: Beat; html?: string }) {
  if (beat.kind === "explicar" || html) {
    return (
      <div
        className="player-html"
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      />
    );
  }
  return null;
}

export function LessonPlayer({
  path,
  doc,
  onLastBeat,
}: {
  path: string;
  doc: LessonDoc;
  onLastBeat?: (atEnd: boolean) => void;
}) {
  const beats = doc.beats;
  const [ready, setReady] = useState(false);
  const [i, setI] = useState(0);
  const [farthest, setFarthest] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});

  useEffect(() => {
    const s = loadStored(path);
    const max = beats.length - 1;
    setI(Math.min(s.i, max));
    setFarthest(Math.min(Math.max(s.farthest, s.i), max));
    setPicks(s.picks);
    setReady(true);
  }, [path, beats.length]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      storageKey(path),
      JSON.stringify({ i, farthest, picks } satisfies Stored)
    );
  }, [path, i, farthest, picks, ready]);

  const beat = beats[i];
  const last = i === beats.length - 1;

  useEffect(() => {
    onLastBeat?.(last);
  }, [last, onLastBeat]);

  const pickedId = beat?.kind === "escolha" ? picks[beat.id] : undefined;
  const picked =
    beat?.kind === "escolha"
      ? beat.options.find((o) => o.id === pickedId)
      : undefined;
  const canAdvance = beat?.kind !== "escolha" || Boolean(picked);

  const progressPercent = useMemo(
    () => Math.round(((i + 1) / beats.length) * 100),
    [i, beats.length]
  );

  function go(next: number) {
    const clamped = Math.max(0, Math.min(beats.length - 1, next));
    setI(clamped);
    setFarthest((f) => Math.max(f, clamped));
  }

  if (!ready || !beat) {
    return <p className="quiz-meta text-muted-foreground py-6">Carregando a aula…</p>;
  }

  return (
    <section className="lesson-player" aria-label="Player interativo da aula">
      {/* Player Progress Header */}
      <div className="player-progress mb-6 p-4 rounded-xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
            Passo {i + 1} de {beats.length}
          </Badge>
          <span className="font-mono text-muted-foreground">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5 bg-secondary" />

        {/* Step dots */}
        <div
          className="player-dots flex items-center justify-center gap-1.5 pt-1"
          role="group"
          aria-label="Passos da aula"
        >
          {beats.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              className={
                idx === i
                  ? "on"
                  : idx <= farthest
                  ? "seen"
                  : undefined
              }
              disabled={idx > farthest}
              aria-label={`Ir ao passo ${idx + 1}`}
              aria-current={idx === i ? "step" : undefined}
              onClick={() => go(idx)}
            />
          ))}
        </div>
      </div>

      {beat.kicker ? (
        <Badge
          variant="outline"
          className="text-xs font-mono text-primary border-primary/30 bg-primary/10 mb-3"
        >
          {beat.kicker}
        </Badge>
      ) : null}

      {/* Beat: Cena */}
      {beat.kind === "cena" ? (
        <div className="space-y-4">
          <h2 className="player-title text-xl sm:text-2xl font-bold font-heading text-foreground">
            {beat.title}
          </h2>
          <div
            className="player-body"
            dangerouslySetInnerHTML={{ __html: beat.body }}
          />
        </div>
      ) : null}

      {/* Beat: Escolha */}
      {beat.kind === "escolha" ? (
        <div className="space-y-4">
          {beat.title ? (
            <h2 className="player-title text-xl sm:text-2xl font-bold font-heading text-foreground">
              {beat.title}
            </h2>
          ) : null}
          <p className="player-prompt text-base font-medium text-foreground">
            {beat.prompt}
          </p>
          <div className="choice-list space-y-2">
            {beat.options.map((opt) => {
              const on = pickedId === opt.id;
              let borderClass = "border-border hover:border-primary/40 hover:bg-secondary/40";
              if (on) {
                if (opt.verdict === "bom") {
                  borderClass = "border-emerald-500/60 bg-emerald-500/10 text-foreground";
                } else if (opt.verdict === "meio") {
                  borderClass = "border-amber-500/60 bg-amber-500/10 text-foreground";
                } else {
                  borderClass = "border-rose-500/60 bg-rose-500/10 text-foreground";
                }
              }

              return (
                <button
                  type="button"
                  key={opt.id}
                  className={`choice-btn w-full text-left p-3.5 rounded-lg border text-sm transition-all duration-200 ${borderClass}`}
                  onClick={() =>
                    setPicks((prev) => ({ ...prev, [beat.id]: opt.id }))
                  }
                >
                  <div className="flex items-start gap-2.5">
                    {on ? (
                      opt.verdict === "bom" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : opt.verdict === "meio" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-border shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {picked ? (
            <div
              className={`choice-why p-4 rounded-lg border text-sm ${
                picked.verdict === "bom"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : picked.verdict === "meio"
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              <strong>{verdictLabel(picked.verdict)}.</strong> {picked.why}
            </div>
          ) : (
            <p className="quiz-meta text-xs text-muted-foreground flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Escolhe uma alternativa. Errar aqui não tranca a aula.</span>
            </p>
          )}
        </div>
      ) : null}

      {/* Beat: Trade-off */}
      {beat.kind === "tradeoff" ? (
        <div className="space-y-4">
          <h2 className="player-title text-xl sm:text-2xl font-bold font-heading text-foreground">
            {beat.title ?? "Trade-off"}
          </h2>
          <div className="tradeoff-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            <article className="p-4 rounded-lg bg-card border border-emerald-500/20 bg-emerald-500/5">
              <div className="kicker text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Benefício
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{beat.ganha}</p>
            </article>
            <article className="p-4 rounded-lg bg-card border border-rose-500/20 bg-rose-500/5">
              <div className="kicker text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider mb-2">
                Custo
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{beat.paga}</p>
            </article>
            <article className="p-4 rounded-lg bg-card border border-border/80">
              <div className="kicker text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider mb-2">
                Quando usar
              </div>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                {beat.quando.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="p-4 rounded-lg bg-card border border-border/80">
              <div className="kicker text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider mb-2">
                Quando não
              </div>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                {beat.quandoNao.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      ) : null}

      {/* Beat: Explicar */}
      {beat.kind === "explicar" ? (
        <div className="space-y-4">
          <h2 className="player-title text-xl sm:text-2xl font-bold font-heading text-foreground">
            {beat.title}
          </h2>
          <BeatBody beat={beat} html={beat.html} />
        </div>
      ) : null}

      {/* Beat: Widget interativo */}
      {beat.kind === "widget" ? (
        <div className="space-y-4">
          {beat.title ? (
            <h2 className="player-title text-xl sm:text-2xl font-bold font-heading text-foreground">
              {beat.title}
            </h2>
          ) : null}
          {beat.body ? (
            <div
              className="player-body"
              dangerouslySetInnerHTML={{ __html: beat.body }}
            />
          ) : null}
          <div className="widget-container rounded-xl overflow-hidden border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
            {WIDGETS[beat.widget]()}
          </div>
        </div>
      ) : null}

      {/* Beat: Recap */}
      {beat.kind === "recap" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="player-title text-xl sm:text-2xl font-bold font-heading text-foreground">
              {beat.title ?? "Três frases para dizer em voz alta"}
            </h2>
          </div>
          <ul className="recap-list space-y-3">
            {beat.bullets.map((item) => (
              <li
                key={item}
                className="p-3.5 rounded-lg bg-secondary/40 border border-border/80 text-sm font-medium text-foreground leading-relaxed flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Navigation Footer */}
      <div className="player-nav flex items-center justify-between pt-8 border-t border-border/80 mt-8">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={i === 0}
          onClick={() => go(i - 1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Button>

        {last ? (
          <Button asChild size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <a href="#simulador-aula">
              <span>Ir ao simulador</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={!canAdvance}
            onClick={() => go(i + 1)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </section>
  );
}
