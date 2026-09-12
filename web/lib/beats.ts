export type Track = "kafka" | "arquitetura";

export type WidgetName =
  | "caderno"
  | "outbox"
  | "quando-kafka"
  | "latencia"
  | "cache";

export type Verdict = "bom" | "meio" | "ruim";

export type ChoiceOption = {
  id: string;
  label: string;
  verdict: Verdict;
  why: string;
};

type BeatBase = {
  id: string;
  kicker?: string;
};

export type CenaBeat = BeatBase & {
  kind: "cena";
  title: string;
  body: string;
};

export type EscolhaBeat = BeatBase & {
  kind: "escolha";
  title?: string;
  prompt: string;
  options: ChoiceOption[];
};

export type TradeoffBeat = BeatBase & {
  kind: "tradeoff";
  title?: string;
  ganha: string;
  paga: string;
  quando: string[];
  quandoNao: string[];
};

export type ExplicarBeat = BeatBase & {
  kind: "explicar";
  title: string;
  html: string;
};

export type WidgetBeat = BeatBase & {
  kind: "widget";
  title?: string;
  widget: WidgetName;
  body?: string;
};

export type RecapBeat = BeatBase & {
  kind: "recap";
  title?: string;
  bullets: string[];
};

export type Beat =
  | CenaBeat
  | EscolhaBeat
  | TradeoffBeat
  | ExplicarBeat
  | WidgetBeat
  | RecapBeat;

export type LessonDoc = {
  beats: Beat[];
};

const KINDS = new Set([
  "cena",
  "escolha",
  "tradeoff",
  "explicar",
  "widget",
  "recap",
]);

const WIDGETS = new Set<WidgetName>([
  "caderno",
  "outbox",
  "quando-kafka",
  "latencia",
  "cache",
]);

function fail(slug: string, msg: string): never {
  throw new Error(`Aula ${slug}: ${msg}`);
}

export function parseLessonDoc(raw: unknown, slug: string): LessonDoc {
  if (!raw || typeof raw !== "object" || !("beats" in raw)) {
    fail(slug, "JSON precisa de { beats: [] }");
  }
  const beats = (raw as { beats: unknown }).beats;
  if (!Array.isArray(beats) || beats.length === 0) {
    fail(slug, "precisa de pelo menos um beat");
  }
  const ids = new Set<string>();
  for (const beat of beats) {
    if (!beat || typeof beat !== "object") fail(slug, "beat inválido");
    const b = beat as Beat;
    if (!b.id || ids.has(b.id)) fail(slug, `id duplicado ou vazio: ${b.id}`);
    ids.add(b.id);
    if (!KINDS.has(b.kind)) fail(slug, `kind desconhecido: ${b.kind}`);
    if (b.kind === "escolha") {
      if (!b.options?.length) fail(slug, `${b.id} sem opções`);
    }
    if (b.kind === "tradeoff") {
      if (!b.ganha || !b.paga) fail(slug, `${b.id} sem ganha/paga`);
      if (!b.quando?.length || !b.quandoNao?.length) {
        fail(slug, `${b.id} precisa de quando e quandoNao`);
      }
    }
    if (b.kind === "widget" && !WIDGETS.has(b.widget)) {
      fail(slug, `${b.id} widget desconhecido: ${b.widget}`);
    }
    if (b.kind === "recap" && !b.bullets?.length) {
      fail(slug, `${b.id} recap vazio`);
    }
  }
  return { beats: beats as Beat[] };
}
