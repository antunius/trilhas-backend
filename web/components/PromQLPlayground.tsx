"use client";

import { useState } from "react";
import { CheckCircle2, Lightbulb, Play, SkipForward, XCircle } from "lucide-react";
import { compareResults, formatLabels, formatValue, runQuery, type Resultado } from "@/lib/promql";
import { Button } from "@/components/ui/button";

export type PromQLChallenge = {
  task: string;
  solution: string;
  starter?: string;
  hint?: string;
};

export type PromQLPlaygroundProps = { challenges: PromQLChallenge[] };

type Outcome =
  | { kind: "error"; message: string }
  | { kind: "done"; result: Resultado; ok: boolean; message: string };

/** Texto com trechos `em crases` renderizados como código, que quebra linha em vez de estourar a margem. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded bg-secondary px-1 py-0.5 font-mono text-[0.85em] break-all">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part.replace(/\*\*/g, "")}</span>
        ),
      )}
    </>
  );
}

function ResultTable({ result }: { result: Resultado }) {
  if (result.kind === "scalar") {
    return <p className="font-mono text-sm text-foreground">Escalar: {formatValue(result.value)}</p>;
  }
  if (result.kind === "range") {
    return <p className="text-sm text-muted-foreground">Vetor de intervalo: {result.count} série(s) com várias amostras.</p>;
  }
  if (result.series.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma série encontrada (resultado vazio).</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-secondary text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">Série</th>
            <th scope="col" className="px-3 py-2 font-medium text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {result.series.map((s, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-3 py-1.5 whitespace-pre-wrap break-all">{formatLabels(s.labels)}</td>
              <td className="px-3 py-1.5 text-right whitespace-nowrap">{formatValue(s.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Challenge({
  c,
  solved,
  last,
  onSolved,
  onNext,
}: {
  c: PromQLChallenge;
  solved: boolean;
  last: boolean;
  onSolved: () => void;
  onNext: () => void;
}) {
  const [query, setQuery] = useState(c.starter ?? "");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);

  const run = () => {
    const got = runQuery(query);
    if (!got.ok) {
      setOutcome({ kind: "error", message: got.error });
      return;
    }
    const ref = runQuery(c.solution);
    if (!ref.ok) {
      setOutcome({ kind: "done", result: got.result, ok: false, message: "Desafio indisponível." });
      return;
    }
    const cmp = compareResults(ref.result, got.result);
    setOutcome({ kind: "done", result: got.result, ok: cmp.ok, message: cmp.message });
    if (cmp.ok) onSolved();
  };

  const ok = solved || (outcome?.kind === "done" && outcome.ok);

  return (
    <div className="min-w-0">
      <label htmlFor="promql-consulta" className="block text-base font-medium text-foreground mb-3 leading-snug break-words">
        <Rich text={c.task} />
      </label>
      <textarea
        id="promql-consulta"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            run();
          }
        }}
        rows={4}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Digite a consulta PromQL"
        className="block w-full max-w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <p className="mt-1 text-xs text-muted-foreground">Ctrl+Enter executa</p>

      {hint && c.hint && !ok ? (
        <p className="flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground mt-3">
          <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          <span className="min-w-0 break-words">{c.hint}</span>
        </p>
      ) : null}

      {outcome ? (
        <div className="mt-4 space-y-3" aria-live="polite">
          {outcome.kind === "error" ? (
            <p className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-foreground">
              <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
              <span className="min-w-0 break-words">{outcome.message}</span>
            </p>
          ) : (
            <>
              <p
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm text-foreground ${
                  outcome.ok ? "border-emerald-500/40 bg-emerald-500/5" : "border-destructive/40 bg-destructive/5"
                }`}
              >
                {outcome.ok ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                )}
                <span className="min-w-0 break-words">
                  {outcome.ok ? "Correto! A saída é a esperada." : `Ainda não. ${outcome.message}`}
                </span>
              </p>
              <ResultTable result={outcome.result} />
            </>
          )}
        </div>
      ) : null}

      {solution ? (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">Uma solução possível:</p>
          <pre className="overflow-x-auto rounded-lg bg-secondary px-3 py-2 font-mono text-xs text-foreground whitespace-pre-wrap break-all">
            {c.solution}
          </pre>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 mt-4">
        {ok ? (
          <Button type="button" onClick={onNext}>
            {last ? "Recomeçar" : "Próximo desafio"}
          </Button>
        ) : (
          <>
            <Button type="button" onClick={run} disabled={!query.trim()}>
              <Play className="w-4 h-4 mr-1" />
              Executar
            </Button>
            {c.hint ? (
              <Button type="button" variant="outline" onClick={() => setHint(true)} disabled={hint}>
                Ver dica
              </Button>
            ) : null}
            <Button type="button" variant="outline" onClick={() => setSolution(true)} disabled={solution}>
              Ver solução
            </Button>
            <Button type="button" variant="ghost" onClick={onNext}>
              <SkipForward className="w-4 h-4 mr-1" />
              Pular
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/** Desafios de PromQL no formato do Pratique: um por vez, meta de resolvidos, dica, pular e solução. */
export function PromQLPlayground({ challenges }: PromQLPlaygroundProps) {
  const total = challenges.length;
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const done = solved.size >= total;

  return (
    <section aria-label="Desafios de PromQL" className="my-8 min-w-0">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-primary mb-2">
        Desafios · {index + 1} de {total}
      </h3>
      <p className={`text-sm mb-4 break-words ${done ? "text-emerald-400" : "text-muted-foreground"}`} data-testid="meta">
        <span className="inline-flex gap-1 mr-2 align-middle" aria-hidden="true">
          {challenges.map((_, i) => (
            <i
              key={i}
              className={`h-2 w-2 rounded-full border ${
                solved.has(i) ? "bg-emerald-500 border-emerald-500" : i === index ? "border-primary" : "border-muted-foreground/60"
              }`}
            />
          ))}
        </span>
        {done
          ? "Todos os desafios resolvidos"
          : `${solved.size} de ${total} resolvidos · um desafio por vez · dados simulados da loja`}
      </p>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 min-w-0">
        <Challenge
          key={index}
          c={challenges[index]}
          solved={solved.has(index)}
          last={index === total - 1}
          onSolved={() => setSolved((s) => new Set(s).add(index))}
          onNext={() => setIndex((i) => (i + 1) % total)}
        />
      </div>
    </section>
  );
}
