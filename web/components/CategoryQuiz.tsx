"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import type { GateQuestion } from "@/lib/gates";
import { markCategoryQuiz } from "@/lib/progress";
import { Button } from "@/components/ui/button";

export function CategoryQuiz({
  categorySlug,
  categoryName,
  questions,
}: {
  categorySlug: string;
  categoryName: string;
  questions: GateQuestion[];
}) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[i];
  const total = questions.length;

  const progressPct = useMemo(
    () => Math.round(((done ? total : i) / Math.max(total, 1)) * 100),
    [done, i, total],
  );

  function choose(opt: number) {
    if (pick !== null || !q) return;
    setPick(opt);
    if (opt === q.a) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 >= total) {
      markCategoryQuiz(categorySlug, score, total);
      setDone(true);
      return;
    }
    setI((x) => x + 1);
    setPick(null);
  }

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-muted-foreground">Sem perguntas nesta categoria ainda.</p>
        <Link
          href={`/category/${categorySlug}`}
          className="text-primary text-sm mt-4 inline-block"
        >
          Voltar
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12">
        <h1 className="text-2xl font-semibold mb-2">Avaliação</h1>
        <p className="text-muted-foreground mb-6">{categoryName}</p>
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <p className="text-3xl font-semibold text-foreground">
            {score}/{total}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {score >= Math.ceil(total * 0.8)
              ? "Bom domínio nesta rodada."
              : "Revise os artigos e tente de novo."}
          </p>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="text-sm text-primary hover:underline"
        >
          Voltar à categoria
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <Link
        href={`/category/${categorySlug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {categoryName}
      </Link>

      <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
        Avaliação · {i + 1}/{total}
      </div>
      <div className="h-1.5 rounded-full bg-secondary mb-8 overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 leading-snug">
        {q.q}
      </h1>

      <div className="space-y-2 mb-6">
        {q.o.map((opt, idx) => {
          const selected = pick === idx;
          const correct = pick !== null && idx === q.a;
          const wrong = selected && idx !== q.a;
          return (
            <button
              key={idx}
              type="button"
              disabled={pick !== null}
              onClick={() => choose(idx)}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                correct
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : wrong
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border bg-card hover:border-primary/40"
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

      {pick !== null ? (
        <div className="rounded-lg border border-border bg-secondary/40 p-4 mb-6 text-sm text-muted-foreground">
          {q.w}
        </div>
      ) : null}

      {pick !== null ? (
        <Button onClick={next}>
          {i + 1 >= total ? "Ver resultado" : "Próxima"}
        </Button>
      ) : null}
    </div>
  );
}
