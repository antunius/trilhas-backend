"use client";

import { useMemo, useState } from "react";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CodePanel,
  PlaybackControls,
  QueuePanel,
  usePlayback,
  type VisualizerCode,
} from "@/components/visualizers/shared";

export type TreeStep = {
  /** Node being processed (index in the level-order `tree` array) */
  current?: number;
  /** Nodes already fully or partially processed */
  visited?: number[];
  /** Nodes highlighted as "being compared" */
  compare?: number[];
  /** Nodes discarded / pruned */
  eliminated?: number[];
  /** Marks this step as the answer being found */
  found?: boolean;
  /** Call stack, outermost call first */
  stack?: string[];
  /** BFS queue, front first */
  queue?: string[];
  /** Small annotation shown under a node, keyed by node index (e.g. returned height) */
  values?: Record<string, string | number>;
  /** Replaces the example's tree for this step — for problems that mutate or build the tree */
  tree?: (number | string | null)[];
  /** 1-indexed source line(s) executed at this step */
  line?: number | number[];
  caption: string;
};

export type TreeExample = {
  id: string;
  label: string;
  /** Level-order (heap-style) array: children of i are 2i+1 and 2i+2; null = no node */
  tree: (number | string | null)[];
  steps: TreeStep[];
};

export type TreeVisualizerProps = {
  title?: string;
  code?: VisualizerCode;
  examples: TreeExample[];
};

type Placed = { i: number; x: number; y: number; label: string | number };

const X_GAP = 56;
const Y_GAP = 64;
const R = 20;

/** In-order x, depth y. Edges are parent → child index pairs. */
export function layoutTree(tree: (number | string | null)[]): {
  nodes: Placed[];
  edges: [number, number][];
  width: number;
  height: number;
} {
  const nodes: Placed[] = [];
  const edges: [number, number][] = [];
  let col = 0;
  let maxDepth = 0;

  function walk(i: number, depth: number) {
    if (i >= tree.length || tree[i] === null || tree[i] === undefined) return;
    walk(2 * i + 1, depth + 1);
    nodes.push({ i, x: col++ * X_GAP + X_GAP / 2, y: depth * Y_GAP + R + 8, label: tree[i] as number | string });
    maxDepth = Math.max(maxDepth, depth);
    walk(2 * i + 2, depth + 1);
    for (const c of [2 * i + 1, 2 * i + 2]) {
      if (c < tree.length && tree[c] !== null && tree[c] !== undefined) edges.push([i, c]);
    }
  }
  walk(0, 0);
  return { nodes, edges, width: Math.max(col, 1) * X_GAP, height: maxDepth * Y_GAP + 2 * R + 28 };
}

export function TreeVisualizer({ title, code, examples }: TreeVisualizerProps) {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const example = examples[exampleIdx];
  const totalSteps = example?.steps.length ?? 0;
  const playback = usePlayback(totalSteps);
  const { stepIdx, setStepIdx, setPlaying } = playback;
  const step = example?.steps[stepIdx];

  const activeTree = step?.tree ?? example?.tree;
  const layout = useMemo(() => (activeTree ? layoutTree(activeTree) : null), [activeTree]);

  function selectExample(i: number) {
    setExampleIdx(i);
    setStepIdx(0);
    setPlaying(false);
  }

  if (!example || !step || !layout) return null;

  const pos = new Map(layout.nodes.map((n) => [n.i, n]));
  const visited = new Set(step.visited ?? []);
  const compare = new Set(step.compare ?? []);
  const eliminated = new Set(step.eliminated ?? []);
  const activeLines = new Set(
    step.line === undefined ? [] : Array.isArray(step.line) ? step.line : [step.line],
  );

  function state(i: number): "found" | "current" | "compare" | "eliminated" | "visited" | "default" {
    if (step!.found && (i === step!.current || compare.has(i))) return "found";
    if (i === step!.current) return "current";
    if (compare.has(i)) return "compare";
    if (eliminated.has(i)) return "eliminated";
    if (visited.has(i)) return "visited";
    return "default";
  }

  const stack = step.stack ?? [];

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

      <div className="px-4 pt-5 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <div className="flex-1 overflow-x-auto">
            <svg
              role="img"
              aria-label={`Árvore: ${example.label}`}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="mx-auto block"
              style={{ width: Math.max(layout.width, 160), maxWidth: "100%", height: "auto" }}
            >
              {layout.edges.map(([a, b]) => {
                const pa = pos.get(a)!;
                const pb = pos.get(b)!;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    className="stroke-border"
                    strokeWidth={2}
                  />
                );
              })}
              {layout.nodes.map((n) => {
                const st = state(n.i);
                const note = step.values?.[String(n.i)];
                return (
                  <g key={n.i} data-node={n.i} data-state={st}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={R}
                      strokeWidth={2}
                      className={cn(
                        "transition-colors duration-300",
                        st === "found" && "fill-[hsl(var(--success)/0.18)] stroke-[hsl(var(--success))]",
                        st === "current" && "fill-primary/20 stroke-primary",
                        st === "compare" && "fill-primary/10 stroke-primary/70",
                        st === "eliminated" && "fill-muted/30 stroke-border",
                        st === "visited" && "fill-secondary stroke-muted-foreground/60",
                        st === "default" && "fill-background stroke-border",
                      )}
                    />
                    <text
                      x={n.x}
                      y={n.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cn(
                        "font-mono text-[13px] font-medium",
                        st === "eliminated" ? "fill-muted-foreground/50" : "fill-foreground",
                      )}
                    >
                      {n.label}
                    </text>
                    {note !== undefined ? (
                      <text
                        x={n.x}
                        y={n.y + R + 12}
                        textAnchor="middle"
                        className="font-mono text-[11px] fill-primary"
                      >
                        {note}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>

          {step.stack !== undefined || step.queue === undefined ? (
          <div className="sm:w-44 shrink-0 rounded-md border border-border bg-background/60 p-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              pilha de chamadas
            </p>
            {stack.length === 0 ? (
              <p className="font-mono text-[11px] text-muted-foreground/60">vazia</p>
            ) : (
              <ul className="flex flex-col-reverse gap-1" aria-label="Pilha de chamadas">
                {stack.map((f, i) => (
                  <li
                    key={`${i}-${f}`}
                    className={cn(
                      "rounded border px-1.5 py-0.5 font-mono text-[11px]",
                      i === stack.length - 1
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
          ) : null}
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

export default TreeVisualizer;
