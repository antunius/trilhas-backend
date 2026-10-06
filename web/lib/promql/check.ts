import type { Labels, Value } from "./types";

export type Resultado =
  | { kind: "scalar"; value: number }
  | { kind: "vector"; series: { labels: Labels; value: number }[] }
  | { kind: "range"; count: number };

export function toResultado(v: Value): Resultado {
  if (v.t === "scalar") return { kind: "scalar", value: v.v };
  if (v.t === "range") return { kind: "range", count: v.s.length };
  return { kind: "vector", series: v.s };
}

export function formatLabels(labels: Labels): string {
  const name = labels.__name__ ?? "";
  const rest = Object.entries(labels)
    .filter(([k]) => k !== "__name__")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}="${v}"`)
    .join(", ");
  return `${name}{${rest}}`;
}

export function formatValue(n: number): string {
  if (Number.isNaN(n)) return "NaN";
  if (!Number.isFinite(n)) return n > 0 ? "+Inf" : "-Inf";
  return String(Number(n.toPrecision(6)));
}

const keyOf = (l: Labels) =>
  Object.entries(l).filter(([k]) => k !== "__name__").sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join(",");
const keysOf = (l: Labels) => Object.keys(l).filter((k) => k !== "__name__").sort();
const close = (a: number, b: number) => (Number.isNaN(a) && Number.isNaN(b)) || a === b || Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));

/** Compara a saída da consulta do aluno com a da solução; o nome da métrica e a ordem não contam. */
export function compareResults(expected: Resultado, got: Resultado): { ok: boolean; message: string } {
  if (got.kind === "range") {
    return { ok: false, message: "Sua consulta devolve várias amostras por série (vetor de intervalo). Aplique rate() ou increase()." };
  }
  if (expected.kind !== got.kind) {
    return {
      ok: false,
      message: expected.kind === "scalar"
        ? "O esperado é um único número, mas sua consulta devolveu séries."
        : "O esperado são séries com labels, mas sua consulta devolveu um número.",
    };
  }
  if (expected.kind === "scalar" && got.kind === "scalar") {
    return close(expected.value, got.value)
      ? { ok: true, message: "Correto!" }
      : { ok: false, message: `Valor diferente: esperado ${formatValue(expected.value)}, obtido ${formatValue(got.value)}.` };
  }
  if (expected.kind !== "vector" || got.kind !== "vector") return { ok: false, message: "Resultado inesperado." };
  if (expected.series.length !== got.series.length) {
    return {
      ok: false,
      message: `Sua consulta devolveu ${got.series.length} série(s); o esperado são ${expected.series.length}.`,
    };
  }
  if (expected.series.length === 0) return { ok: true, message: "Correto!" };
  const exK = keysOf(expected.series[0].labels).join(", ") || "nenhum";
  const goK = keysOf(got.series[0].labels).join(", ") || "nenhum";
  if (exK !== goK) {
    return { ok: false, message: `Os labels do resultado diferem: esperado [${exK}], obtido [${goK}]. Revise o by/without.` };
  }
  const want = new Map(expected.series.map((s) => [keyOf(s.labels), s.value]));
  for (const s of got.series) {
    const k = keyOf(s.labels);
    if (!want.has(k)) return { ok: false, message: `A série ${formatLabels(s.labels)} não era esperada.` };
    if (!close(want.get(k)!, s.value)) {
      return {
        ok: false,
        message: `Valores diferentes em ${formatLabels(s.labels)}: esperado ${formatValue(want.get(k)!)}, obtido ${formatValue(s.value)}.`,
      };
    }
  }
  return { ok: true, message: "Correto!" };
}
