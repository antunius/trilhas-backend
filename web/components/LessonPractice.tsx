"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Lightbulb, SkipForward, XCircle } from "lucide-react";
import type { GateQuestion } from "@/lib/gates";
import {
  emptyPractice,
  metaDe,
  pickQuestion,
  recordAnswer,
  shuffleOptions,
  type PracticeState,
} from "@/lib/practice";
import { getPractice, isProgressHydrated, savePractice } from "@/lib/progress";
import { Button } from "@/components/ui/button";

type Current = { index: number; o: string[]; a: number };

/** Prática no fim da lição: meta de acertos, uma questão por vez, dica, pular e solução. */
export function LessonPractice({
  path,
  questions,
}: {
  path: string;
  questions: GateQuestion[];
}) {
  const total = questions.length;
  const meta = metaDe(total);
  const [practice, setPractice] = useState<PracticeState>(emptyPractice());
  const [current, setCurrent] = useState<Current | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<{ ok: boolean } | null>(null);
  const [hint, setHint] = useState(false);
  const started = useRef(false);

  const show = useCallback(
    (state: PracticeState) => {
      const { index, seen } = pickQuestion(total, state);
      const next = { ...state, seen };
      savePractice(path, next);
      setPractice(next);
      setCurrent({ index, ...shuffleOptions(questions[index]) });
      setPicked(null);
      setResult(null);
      setHint(false);
    },
    [path, questions, total],
  );

  useEffect(() => {
    if (total === 0) return;
    const start = () => {
      if (started.current || !isProgressHydrated()) return;
      started.current = true;
      show(getPractice(path));
    };
    start();
    window.addEventListener("trilhas-progress", start);
    // sem progresso carregado (sessão ainda não resolvida), a prática funciona mesmo assim,
    // só que sem salvar; assim o bloco nunca fica invisível
    const fallback = window.setTimeout(() => {
      if (started.current) return;
      started.current = true;
      show(emptyPractice());
    }, 1500);
    return () => {
      window.removeEventListener("trilhas-progress", start);
      window.clearTimeout(fallback);
    };
  }, [path, show, total]);

  if (total === 0) return null;
  if (!current) {
    return (
      <section aria-labelledby="pratique" className="mt-14">
        <h2
          id="pratique"
          className="font-mono text-[11px] uppercase tracking-widest text-primary mb-2"
        >
          Pratique
        </h2>
        <p className="text-sm text-muted-foreground" data-testid="carregando">
          Carregando perguntas…
        </p>
      </section>
    );
  }
  const q = questions[current.index];

  function check() {
    if (picked === null || result || !current) return;
    const ok = picked === current.a;
    const next = recordAnswer(practice, current.index, ok, total);
    savePractice(path, next);
    setPractice(next);
    setResult({ ok });
  }

  const shownCorrect = Math.min(practice.correct, meta);

  return (
    <section aria-labelledby="pratique" className="mt-14">
      <h2
        id="pratique"
        className="font-mono text-[11px] uppercase tracking-widest text-primary mb-2"
      >
        Pratique
      </h2>
      <p
        className={`text-sm mb-5 ${practice.done ? "text-emerald-400" : "text-muted-foreground"}`}
        data-testid="meta"
      >
        <span className="inline-flex gap-1 mr-2 align-middle" aria-hidden="true">
          {Array.from({ length: meta }, (_, i) => (
            <i
              key={i}
              className={`h-2 w-2 rounded-full border ${
                i < shownCorrect
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-muted-foreground/60"
              }`}
            />
          ))}
        </span>
        {practice.done
          ? `Lição concluída, ${practice.correct} acertos · continue praticando se quiser`
          : `${shownCorrect} de ${meta} acertos para concluir · questões novas a cada resposta · solução depois de responder`}
      </p>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-foreground mb-4 leading-snug">
          {q.q}
        </h3>

        <div className="space-y-2 mb-4" role="radiogroup" aria-label="Opções">
          {current.o.map((opt, idx) => {
            const selected = picked === idx;
            const correct = result !== null && idx === current.a;
            const wrong = result !== null && selected && idx !== current.a;
            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={result !== null}
                onClick={() => setPicked(idx)}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors ${
                  correct
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : wrong
                      ? "border-destructive/50 bg-destructive/10"
                      : selected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                }`}
              >
                <span className="flex items-start gap-2">
                  {correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  ) : wrong ? (
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  ) : null}
                  <span>{opt}</span>
                </span>
              </button>
            );
          })}
        </div>

        {hint && q.h && !result ? (
          <p className="flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground mb-4">
            <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <span>{q.h}</span>
          </p>
        ) : null}

        {result ? (
          <div
            className={`rounded-lg border px-4 py-3 text-sm mb-4 ${
              result.ok
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-destructive/40 bg-destructive/5"
            }`}
            data-testid="solucao"
          >
            <p className="font-medium text-foreground mb-1">
              {result.ok ? "Correto." : "Ainda não."}
            </p>
            <p className="text-muted-foreground leading-relaxed">{q.w}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {result ? (
            <Button type="button" onClick={() => show(practice)}>
              Próxima
            </Button>
          ) : (
            <>
              <Button type="button" onClick={check} disabled={picked === null}>
                Conferir
              </Button>
              {q.h ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setHint(true)}
                  disabled={hint}
                >
                  Ver dica
                </Button>
              ) : null}
              <Button type="button" variant="ghost" onClick={() => show(practice)}>
                <SkipForward className="w-4 h-4 mr-1" />
                Pular
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
