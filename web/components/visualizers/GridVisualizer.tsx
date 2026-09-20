"use client";

import { useState } from "react";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CodePanel,
  PlaybackControls,
  QueuePanel,
  usePlayback,
  type VisualizerCode,
} from "@/components/visualizers/shared";

type Cell = [number, number];

export type GridStep = {
  /** Cell being processed */
  current?: Cell;
  /** Cells already discovered/processed */
  visited?: Cell[];
  /** Cells waiting in the queue */
  frontier?: Cell[];
  compare?: Cell[];
  found?: boolean;
  /** Replaces the example's grid for this step (cells that change) */
  grid?: (string | number)[][];
  /** Annotation drawn inside a cell, keyed "r,c" (e.g. distance) */
  values?: Record<string, string | number>;
  queue?: string[];
  line?: number | number[];
  caption: string;
};

export type GridExample = {
  id: string;
  label: string;
  /** "#" = wall, "." = empty */
  grid: (string | number)[][];
  steps: GridStep[];
};

export type GridVisualizerProps = {
  title?: string;
  code?: VisualizerCode;
  examples: GridExample[];
};

const key = (c: Cell) => `${c[0]},${c[1]}`;

export function GridVisualizer({ title, code, examples }: GridVisualizerProps) {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const example = examples[exampleIdx];
  const totalSteps = example?.steps.length ?? 0;
  const playback = usePlayback(totalSteps);
  const { stepIdx, setStepIdx, setPlaying } = playback;
  const step = example?.steps[stepIdx];

  if (!example || !step) return null;

  const grid = step.grid ?? example.grid;
  const visited = new Set((step.visited ?? []).map(key));
  const frontier = new Set((step.frontier ?? []).map(key));
  const compare = new Set((step.compare ?? []).map(key));
  const cur = step.current ? key(step.current) : undefined;
  const activeLines = new Set(
    step.line === undefined ? [] : Array.isArray(step.line) ? step.line : [step.line],
  );

  function state(k: string, label: string | number) {
    if (String(label) === "#") return "wall";
    if (step!.found && (k === cur || compare.has(k))) return "found";
    if (k === cur) return "current";
    if (compare.has(k)) return "compare";
    if (frontier.has(k)) return "frontier";
    if (visited.has(k)) return "visited";
    return "default";
  }

  return (
    <div className="my-6 rounded-lg border border-border bg-card/60 overflow-hidden not-prose">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/60 border-b border-border">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          {title || "visualização"}
        </span>
        {code ? (
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            {showCode ? "ocultar código" : "mostrar código"}
          </button>
        ) : null}
      </div>

      {code && showCode ? <CodePanel code={code} activeLines={activeLines} /> : null}

      {examples.length > 1 ? (
        <div className="flex flex-wrap gap-2 px-4 pt-4">
          {examples.map((ex, i) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                setExampleIdx(i);
                setStepIdx(0);
                setPlaying(false);
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                i === exampleIdx
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {ex.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="px-4 pt-5 pb-4">
        <div
          role="img"
          aria-label={`Grade: ${example.label}`}
          className="mx-auto grid w-fit gap-1"
          style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((label, c) => {
              const k = `${r},${c}`;
              const st = state(k, label);
              const note = step.values?.[k];
              const shown = note ?? (String(label) === "." || String(label) === "#" ? "" : label);
              return (
                <div
                  key={k}
                  data-cell={k}
                  data-state={st}
                  className={cn(
                    "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-md border font-mono text-sm font-medium transition-colors duration-300",
                    st === "wall" && "border-border bg-foreground/80",
                    st === "found" && "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))]",
                    st === "current" && "border-primary bg-primary/20 text-primary",
                    st === "compare" && "border-primary/70 bg-primary/10 text-primary",
                    st === "frontier" && "border-dashed border-primary bg-background text-primary",
                    st === "visited" && "border-muted-foreground/40 bg-secondary text-foreground",
                    st === "default" && "border-border bg-background text-foreground",
                  )}
                >
                  {shown}
                </div>
              );
            }),
          )}
        </div>

        <QueuePanel items={step.queue} />

        <p className="mt-4 min-h-[2.5rem] text-center text-sm text-foreground/90 leading-relaxed">
          {step.caption}
        </p>
      </div>

      <PlaybackControls playback={playback} totalSteps={totalSteps} />
    </div>
  );
}

export default GridVisualizer;
