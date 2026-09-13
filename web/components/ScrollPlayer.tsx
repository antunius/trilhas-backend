"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type {
  Beat,
  ChoiceOption,
  LessonDoc,
  SecaoBeat,
  WidgetName,
} from "@/lib/beats";
import { CadernoKafka } from "@/components/CadernoKafka";
import { OutboxWalkthrough } from "@/components/OutboxWalkthrough";
import { WhenKafka } from "@/components/WhenKafka";
import { LatencyLevers } from "@/components/LatencyLevers";
import { CacheLab } from "@/components/CacheLab";
import { TableOfContents } from "@/components/TableOfContents";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const WIDGETS: Record<WidgetName, () => ReactNode> = {
  caderno: () => <CadernoKafka />,
  outbox: () => <OutboxWalkthrough />,
  "quando-kafka": () => <WhenKafka />,
  latencia: () => <LatencyLevers />,
  cache: () => <CacheLab />,
};

type Stored = {
  lastSeen: string | null;
  picks: Record<string, string>;
};

function storageKey(path: string) {
  return `trilhas-scroll:${path}`;
}

function loadStored(path: string): Stored {
  try {
    const raw = localStorage.getItem(storageKey(path));
    if (!raw) return { lastSeen: null, picks: {} };
    const parsed = JSON.parse(raw) as Stored;
    return {
      lastSeen: parsed.lastSeen ?? null,
      picks: parsed.picks ?? {},
    };
  } catch {
    return { lastSeen: null, picks: {} };
  }
}

function verdictLabel(v: ChoiceOption["verdict"]) {
  if (v === "bom") return "Essa segura";
  if (v === "meio") return "Quase — falta o preço";
  return "Por aqui quebra";
}

function BeatBlock({
  beat,
  picks,
  onPick,
}: {
  beat: Beat;
  picks: Record<string, string>;
  onPick: (beatId: string, optionId: string) => void;
}) {
  if (beat.kind === "secao") {
    return (
      <header className="scroll-secao pt-4 pb-2 border-b border-border/70 mb-2">
        <Badge
          variant="outline"
          className="text-[10px] font-mono text-primary border-primary/30 bg-primary/10 mb-2"
        >
          Seção
        </Badge>
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground tracking-tight">
          {beat.title}
        </h2>
        {beat.subtitle ? (
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {beat.subtitle}
          </p>
        ) : null}
      </header>
    );
  }

  if (beat.kind === "cena") {
    return (
      <div className="space-y-3">
        {beat.kicker ? (
          <Badge
            variant="outline"
            className="text-xs font-mono text-primary border-primary/30 bg-primary/10"
          >
            {beat.kicker}
          </Badge>
        ) : null}
        <h3 className="player-title text-lg sm:text-xl font-bold font-heading text-foreground">
          {beat.title}
        </h3>
        <div
          className="player-body"
          dangerouslySetInnerHTML={{ __html: beat.body }}
        />
      </div>
    );
  }

  if (beat.kind === "explicar") {
    return (
      <div className="space-y-3">
        {beat.kicker ? (
          <Badge
            variant="outline"
            className="text-xs font-mono text-muted-foreground border-border/80"
          >
            {beat.kicker}
          </Badge>
        ) : null}
        <h3 className="player-title text-lg sm:text-xl font-bold font-heading text-foreground">
          {beat.title}
        </h3>
        <div
          className="player-html"
          dangerouslySetInnerHTML={{ __html: beat.html }}
        />
      </div>
    );
  }

  if (beat.kind === "escolha") {
    const pickedId = picks[beat.id];
    const picked = beat.options.find((o) => o.id === pickedId);
    return (
      <div className="space-y-4 p-4 sm:p-5 rounded-xl border border-border/80 bg-card/60">
        {beat.kicker ? (
          <Badge
            variant="outline"
            className="text-xs font-mono text-primary border-primary/30 bg-primary/10"
          >
            {beat.kicker}
          </Badge>
        ) : null}
        {beat.title ? (
          <h3 className="player-title text-lg font-bold font-heading text-foreground">
            {beat.title}
          </h3>
        ) : null}
        <p className="player-prompt text-base font-medium text-foreground">
          {beat.prompt}
        </p>
        <div className="choice-list space-y-2">
          {beat.options.map((opt) => {
            const on = pickedId === opt.id;
            let borderClass =
              "border-border hover:border-primary/40 hover:bg-secondary/40";
            if (on) {
              if (opt.verdict === "bom") {
                borderClass =
                  "border-emerald-500/60 bg-emerald-500/10 text-foreground";
              } else if (opt.verdict === "meio") {
                borderClass =
                  "border-amber-500/60 bg-amber-500/10 text-foreground";
              } else {
                borderClass =
                  "border-rose-500/60 bg-rose-500/10 text-foreground";
              }
            }
            return (
              <button
                type="button"
                key={opt.id}
                className={`choice-btn w-full text-left p-3.5 rounded-lg border text-sm transition-all duration-200 ${borderClass}`}
                onClick={() => onPick(beat.id, opt.id)}
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
    );
  }

  if (beat.kind === "tradeoff") {
    return (
      <div className="space-y-4">
        <h3 className="player-title text-lg sm:text-xl font-bold font-heading text-foreground">
          {beat.title ?? "Trade-off"}
        </h3>
        <div className="tradeoff-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
          <article className="p-4 rounded-lg bg-card border border-emerald-500/20 bg-emerald-500/5">
            <div className="kicker text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Benefício
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {beat.ganha}
            </p>
          </article>
          <article className="p-4 rounded-lg bg-card border border-rose-500/20 bg-rose-500/5">
            <div className="kicker text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider mb-2">
              Custo
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {beat.paga}
            </p>
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
    );
  }

  if (beat.kind === "widget") {
    return (
      <div className="space-y-4">
        {beat.kicker ? (
          <Badge
            variant="outline"
            className="text-xs font-mono text-primary border-primary/30 bg-primary/10"
          >
            {beat.kicker}
          </Badge>
        ) : null}
        {beat.title ? (
          <h3 className="player-title text-lg sm:text-xl font-bold font-heading text-foreground">
            {beat.title}
          </h3>
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
    );
  }

  if (beat.kind === "recap") {
    return (
      <div className="space-y-4 p-4 sm:p-5 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="player-title text-lg sm:text-xl font-bold font-heading text-foreground">
            {beat.title ?? "Três frases para dizer em voz alta"}
          </h3>
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
    );
  }

  return null;
}

export function ScrollPlayer({
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
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [activeSecao, setActiveSecao] = useState<string | undefined>();
  const restoredRef = useRef(false);

  const secoes = useMemo(
    () => beats.filter((b): b is SecaoBeat => b.kind === "secao"),
    [beats],
  );

  const progressPercent = useMemo(() => {
    if (beats.length === 0) return 0;
    return Math.round((seen.size / beats.length) * 100);
  }, [seen, beats.length]);

  const atEnd = seen.size >= beats.length && beats.length > 0;

  useEffect(() => {
    onLastBeat?.(atEnd);
  }, [atEnd, onLastBeat]);

  useEffect(() => {
    const s = loadStored(path);
    setPicks(s.picks);
    setReady(true);
  }, [path]);

  useEffect(() => {
    if (!ready) return;
    const lastSeen =
      [...seen].reverse().find((id) => beats.some((b) => b.id === id)) ?? null;
    localStorage.setItem(
      storageKey(path),
      JSON.stringify({ lastSeen, picks } satisfies Stored),
    );
  }, [path, seen, picks, ready, beats]);

  useEffect(() => {
    if (!ready || restoredRef.current) return;
    const s = loadStored(path);
    if (s.lastSeen) {
      const el = document.getElementById(`beat-${s.lastSeen}`);
      if (el) {
        restoredRef.current = true;
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "instant", block: "center" });
        });
      }
    } else {
      restoredRef.current = true;
    }
  }, [ready, path]);

  useEffect(() => {
    if (!ready) return;
    const observers: IntersectionObserver[] = [];
    const secaoIds = new Set(secoes.map((s) => s.id));

    for (const beat of beats) {
      const el = document.getElementById(`beat-${beat.id}`);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            setSeen((prev) => {
              if (prev.has(beat.id)) return prev;
              const next = new Set(prev);
              next.add(beat.id);
              return next;
            });
            if (secaoIds.has(beat.id)) {
              setActiveSecao(beat.id);
            }
          }
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: 0.1 },
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [ready, beats, secoes]);

  const onPick = useCallback((beatId: string, optionId: string) => {
    setPicks((prev) => ({ ...prev, [beatId]: optionId }));
  }, []);

  if (!ready) {
    return (
      <p className="quiz-meta text-muted-foreground py-6">Carregando a aula…</p>
    );
  }

  return (
    <section className="scroll-player" aria-label="Capítulo em scroll contínuo">
      <div className="player-progress mb-6 p-4 rounded-xl bg-card border border-border/80 shadow-sm space-y-3 sticky top-0 z-20 backdrop-blur-sm bg-card/95">
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
            {seen.size} de {beats.length} blocos
          </Badge>
          <span className="font-mono text-muted-foreground">
            {progressPercent}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-1.5 bg-secondary" />
      </div>

      <div className="lg:flex lg:gap-8 lg:items-start">
        <TableOfContents secoes={secoes} activeId={activeSecao} />

        <div className="flex-1 min-w-0 space-y-10 pb-8">
          {beats.map((beat) => (
            <article
              key={beat.id}
              id={`beat-${beat.id}`}
              className={`scroll-beat scroll-mt-28 ${
                beat.kind === "secao" ? "pt-6" : ""
              }`}
              data-kind={beat.kind}
            >
              <BeatBlock beat={beat} picks={picks} onPick={onPick} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
