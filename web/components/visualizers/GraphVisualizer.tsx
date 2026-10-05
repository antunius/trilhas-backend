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

type Id = string | number;

export type GraphStep = {
  /** Node being processed */
  current?: Id;
  /** Nodes already discovered/processed */
  visited?: Id[];
  /** Nodes waiting in the queue */
  frontier?: Id[];
  compare?: Id[];
  eliminated?: Id[];
  /** Edge highlighted at this step */
  activeEdge?: [Id, Id];
  found?: boolean;
  /** Queue contents, front first */
  queue?: string[];
  /** Small annotation under a node (distance, in-degree...) */
  values?: Record<string, string | number>;
  line?: number | number[];
  caption: string;
};

export type GraphExample = {
  id: string;
  label: string;
  nodes: { id: Id; label?: string | number; x: number; y: number }[];
  edges: [Id, Id][];
  directed?: boolean;
  steps: GraphStep[];
};

export type GraphVisualizerProps = {
  title?: string;
  code?: VisualizerCode;
  examples: GraphExample[];
};

const R = 20;

export function GraphVisualizer({ title, code, examples }: GraphVisualizerProps) {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const example = examples[exampleIdx];
  const totalSteps = example?.steps.length ?? 0;
  const playback = usePlayback(totalSteps);
  const { stepIdx, setStepIdx, setPlaying } = playback;
  const step = example?.steps[stepIdx];

  if (!example || !step) return null;

  const pos = new Map(example.nodes.map((n) => [String(n.id), n]));
  const width = Math.max(...example.nodes.map((n) => n.x)) + R + 16;
  const height = Math.max(...example.nodes.map((n) => n.y)) + R + 24;
  const sets = {
    visited: new Set((step.visited ?? []).map(String)),
    frontier: new Set((step.frontier ?? []).map(String)),
    compare: new Set((step.compare ?? []).map(String)),
    eliminated: new Set((step.eliminated ?? []).map(String)),
  };
  const cur = step.current === undefined ? undefined : String(step.current);
  const activeLines = new Set(
    step.line === undefined ? [] : Array.isArray(step.line) ? step.line : [step.line],
  );

  function state(id: string) {
    if (step!.found && (id === cur || sets.compare.has(id))) return "found";
    if (id === cur) return "current";
    if (sets.compare.has(id)) return "compare";
    if (sets.frontier.has(id)) return "frontier";
    if (sets.eliminated.has(id)) return "eliminated";
    if (sets.visited.has(id)) return "visited";
    return "default";
  }

  const edgeKey = step.activeEdge ? [String(step.activeEdge[0]), String(step.activeEdge[1])] : null;

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
        <div className="overflow-x-auto">
          <svg
            role="img"
            aria-label={`Grafo: ${example.label}`}
            viewBox={`0 0 ${width} ${height}`}
            className="mx-auto block"
            style={{ width: Math.max(width, 200), maxWidth: "100%", height: "auto" }}
          >
            {example.directed ? (
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-muted-foreground" />
                </marker>
              </defs>
            ) : null}
            {example.edges.map(([a, b]) => {
              const pa = pos.get(String(a))!;
              const pb = pos.get(String(b))!;
              const dx = pb.x - pa.x;
              const dy = pb.y - pa.y;
              const len = Math.hypot(dx, dy) || 1;
              const ux = dx / len;
              const uy = dy / len;
              const active =
                edgeKey &&
                ((edgeKey[0] === String(a) && edgeKey[1] === String(b)) ||
                  (!example.directed && edgeKey[0] === String(b) && edgeKey[1] === String(a)));
              return (
                <line
                  key={`${a}-${b}`}
                  data-edge={`${a}-${b}`}
                  x1={pa.x + ux * R}
                  y1={pa.y + uy * R}
                  x2={pb.x - ux * (R + (example.directed ? 4 : 0))}
                  y2={pb.y - uy * (R + (example.directed ? 4 : 0))}
                  className={active ? "stroke-primary" : "stroke-border"}
                  strokeWidth={active ? 3 : 2}
                  markerEnd={example.directed ? "url(#arrow)" : undefined}
                />
              );
            })}
            {example.nodes.map((n) => {
              const id = String(n.id);
              const st = state(id);
              const note = step.values?.[id];
              return (
                <g key={id} data-node={id} data-state={st}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R}
                    strokeWidth={2}
                    strokeDasharray={st === "frontier" ? "4 3" : undefined}
                    className={cn(
                      "transition-colors duration-300",
                      st === "found" && "fill-[hsl(var(--success)/0.18)] stroke-[hsl(var(--success))]",
                      st === "current" && "fill-primary/20 stroke-primary",
                      st === "compare" && "fill-primary/10 stroke-primary/70",
                      st === "frontier" && "fill-background stroke-primary",
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
                    className="font-mono text-[12px] font-medium fill-foreground"
                  >
                    {n.label ?? n.id}
                  </text>
                  {note !== undefined ? (
                    <text x={n.x} y={n.y + R + 13} textAnchor="middle" className="font-mono text-[11px] fill-primary">
                      {note}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
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

export default GraphVisualizer;
