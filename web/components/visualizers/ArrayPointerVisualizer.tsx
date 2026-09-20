"use client";

import { useMemo, useState } from "react";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CodePanel,
  PlaybackControls,
  usePlayback,
  type VisualizerCode,
} from "@/components/visualizers/shared";

export type VisualizerStep = {
  /** Named pointers, e.g. { left: 0, right: 6 } or { i: 2, j: 4 } */
  pointers: Record<string, number>;
  /** Indices to highlight as "currently being compared" */
  compare?: number[];
  /** Indices to highlight as eliminated/discarded from the search */
  eliminated?: number[];
  /** Marks this step as the answer being found */
  found?: boolean;
  /** Caption explaining what happens at this step */
  caption: string;
  /** Overrides the example's array for this step — for in-place mutations (swaps) */
  array?: (number | string)[];
  /** 1-indexed source line(s) executed at this step, highlighted in the code panel */
  line?: number | number[];
};

export type VisualizerExample = {
  id: string;
  label: string;
  /** Array cells — numbers for array/index problems, single characters for string problems */
  array: (number | string)[];
  target?: number;
  steps: VisualizerStep[];
};

export type { VisualizerCode };

export type ArrayPointerVisualizerProps = {
  title?: string;
  code?: VisualizerCode;
  examples: VisualizerExample[];
};

export function ArrayPointerVisualizer({ title, code, examples }: ArrayPointerVisualizerProps) {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const example = examples[exampleIdx];
  const totalSteps = example?.steps.length ?? 0;
  const playback = usePlayback(totalSteps);
  const { stepIdx, setStepIdx, setPlaying } = playback;
  const step = example?.steps[stepIdx];

  const pointerNames = useMemo(() => Object.keys(step?.pointers ?? {}), [step]);

  function selectExample(i: number) {
    setExampleIdx(i);
    setStepIdx(0);
    setPlaying(false);
  }

  if (!example || !step) return null;

  function pointersAtIndex(i: number): string[] {
    return pointerNames.filter((name) => step!.pointers[name] === i);
  }

  function cellState(i: number): "found" | "compare" | "eliminated" | "default" {
    if (step!.found && step!.compare?.includes(i)) return "found";
    if (step!.compare?.includes(i)) return "compare";
    if (step!.eliminated?.includes(i)) return "eliminated";
    return "default";
  }

  const activeLines = new Set(
    step.line === undefined ? [] : Array.isArray(step.line) ? step.line : [step.line],
  );

  return (
    <div className="my-6 rounded-lg border border-border bg-card/60 overflow-hidden not-prose">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/60 border-b border-border">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          {title || "visualização"}
        </span>
        <div className="flex items-center gap-3">
          {example.target !== undefined ? (
            <span className="font-mono text-xs text-muted-foreground">
              alvo = <span className="text-foreground font-semibold">{example.target}</span>
            </span>
          ) : null}
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
      </div>

      {code && showCode ? <CodePanel code={code} activeLines={activeLines} /> : null}

      {examples.length > 1 ? (
        <div className="flex flex-wrap gap-2 px-4 pt-4">
          {examples.map((ex, i) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => selectExample(i)}
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

      <div className="px-4 pt-6 pb-4">
        <div className="flex justify-center gap-1.5 flex-wrap">
          {(step.array ?? example.array).map((value, i) => {
            const state = cellState(i);
            const names = pointersAtIndex(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md border font-mono text-sm sm:text-base font-medium transition-colors duration-300",
                    state === "found" &&
                      "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))]",
                    state === "compare" &&
                      "border-primary bg-primary/15 text-primary",
                    state === "eliminated" &&
                      "border-border bg-muted/30 text-muted-foreground/50",
                    state === "default" &&
                      "border-border bg-background text-foreground",
                  )}
                >
                  {value}
                </div>
                <div className="h-4 flex items-center justify-center gap-0.5">
                  {names.map((name) => (
                    <span
                      key={name}
                      className="rounded bg-primary/20 px-1 font-mono text-[10px] font-semibold leading-tight text-primary"
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/60">{i}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 min-h-[2.5rem] text-center text-sm text-foreground/90 leading-relaxed">
          {step.caption}
        </p>
      </div>

      <PlaybackControls playback={playback} totalSteps={totalSteps} />
    </div>
  );
}

export default ArrayPointerVisualizer;
