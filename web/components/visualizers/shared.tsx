"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const JAVA_KEYWORDS = new Set([
  "public", "private", "protected", "static", "final", "void", "int", "long",
  "double", "float", "boolean", "char", "class", "interface", "new", "return",
  "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
  "this", "super", "import", "package", "try", "catch", "finally", "throw",
  "throws", "extends", "implements", "enum", "null", "true", "false", "instanceof",
]);

const JAVA_TOKEN_RE = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;

export function tokenizeLine(line: string, lang: string) {
  if (lang !== "java") return line;
  const nodes: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let i = 0;
  JAVA_TOKEN_RE.lastIndex = 0;
  while ((match = JAVA_TOKEN_RE.exec(line))) {
    const [, comment, str, num, ident, ws, other] = match;
    if (comment) {
      nodes.push(
        <span key={i++} className="text-muted-foreground/70 italic">
          {comment}
        </span>,
      );
    } else if (str) {
      nodes.push(
        <span key={i++} className="text-[hsl(var(--success))]">
          {str}
        </span>,
      );
    } else if (num) {
      nodes.push(
        <span key={i++} className="text-[hsl(30_90%_65%)]">
          {num}
        </span>,
      );
    } else if (ident) {
      nodes.push(
        JAVA_KEYWORDS.has(ident) ? (
          <span key={i++} className="text-primary">
            {ident}
          </span>
        ) : (
          <Fragment key={i++}>{ident}</Fragment>
        ),
      );
    } else if (ws) {
      nodes.push(<Fragment key={i++}>{ws}</Fragment>);
    } else if (other) {
      nodes.push(<Fragment key={i++}>{other}</Fragment>);
    }
  }
  return nodes;
}

export type VisualizerCode = {
  lang: string;
  content: string;
};

export const SPEEDS = [0.5, 1, 2] as const;

/** Step index + autoplay timer shared by all step-by-step visualizers. */
export function usePlayback(totalSteps: number) {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setStepIdx((i) => {
        if (i >= totalSteps - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1100 / speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, totalSteps]);

  return { stepIdx, setStepIdx, playing, setPlaying, speed, setSpeed };
}

export type Playback = ReturnType<typeof usePlayback>;

/** Java source with the currently executing line(s) highlighted. */
export function CodePanel({
  code,
  activeLines,
}: {
  code: VisualizerCode;
  activeLines: Set<number>;
}) {
  return (
        <div className="border-b border-border bg-[#0a0e14] overflow-auto" style={{ maxHeight: "22rem" }}>
          <pre className="m-0 py-3">
            {code.content.split("\n").map((line, idx) => {
              const lineNumber = idx + 1;
              const active = activeLines.has(lineNumber);
              return (
                <div
                  key={lineNumber}
                  className={cn(
                    "px-2 font-mono text-[13px] leading-[1.65] whitespace-pre border-l-2 transition-colors duration-300",
                    active
                      ? "bg-primary/15 border-primary"
                      : "border-transparent",
                  )}
                >
                  <span className="inline-block w-7 select-none text-right pr-3 text-muted-foreground/40">
                    {lineNumber}
                  </span>
                  <span className={active ? "text-foreground" : "text-foreground/80"}>
                    {tokenizeLine(line, code.lang)}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
  );
}

export function PlaybackControls({
  playback,
  totalSteps,
}: {
  playback: Playback;
  totalSteps: number;
}) {
  const { stepIdx, setStepIdx, playing, setPlaying, speed, setSpeed } = playback;
  return (
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border bg-secondary/30">
        <button
          type="button"
          aria-label="Reiniciar"
          onClick={() => {
            setStepIdx(0);
            setPlaying(false);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Passo anterior"
          onClick={() => {
            setPlaying(false);
            setStepIdx((i) => Math.max(0, i - 1));
          }}
          disabled={stepIdx === 0}
          className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pausar" : "Reproduzir"}
          onClick={() => setPlaying((p) => !p)}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>
        <button
          type="button"
          aria-label="Próximo passo"
          onClick={() => {
            setPlaying(false);
            setStepIdx((i) => Math.min(totalSteps - 1, i + 1));
          }}
          disabled={stepIdx === totalSteps - 1}
          className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs text-muted-foreground ml-1">
          {stepIdx + 1} / {totalSteps}
        </span>

        <div className="ml-auto flex items-center gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[11px] transition-colors",
                s === speed
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
  );
}

/** Queue contents, front on the left — for BFS visualizers. */
export function QueuePanel({ items }: { items?: string[] }) {
  if (!items) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        fila (frente à esquerda)
      </span>
      {items.length === 0 ? (
        <span className="font-mono text-[11px] text-muted-foreground/60">vazia</span>
      ) : (
        <ul aria-label="Fila" className="flex flex-wrap gap-1">
          {items.map((f, i) => (
            <li
              key={`${i}-${f}`}
              className={cn(
                "rounded border px-1.5 py-0.5 font-mono text-[11px]",
                i === 0
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
  );
}
