import { loja, NOW } from "./dataset";
import { AGG_OPS, type Matcher, type Matching, type Node } from "./parse";
import { PromQLError, type Labels, type Sample, type Series, type Value } from "./types";

const LOOKBACK = 300; // 5 min, como no Prometheus

function matches(labels: Labels, m: Matcher): boolean {
  const v = labels[m.name] ?? ""; // label ausente equivale a ""
  switch (m.op) {
    case "=": return v === m.value;
    case "!=": return v !== m.value;
    case "=~":
    case "!~": {
      let re: RegExp;
      try { re = new RegExp(`^(?:${m.value})$`); } // a regex do Prometheus é totalmente ancorada
      catch { throw new PromQLError(`Expressão regular inválida: "${m.value}".`); }
      return re.test(v) === (m.op === "=~");
    }
  }
}

function select(data: Series[], node: Extract<Node, { t: "sel" }>): Series[] {
  const ms = node.name ? [{ name: "__name__", op: "=" as const, value: node.name }, ...node.matchers] : node.matchers;
  return data.filter((s) => ms.every((m) => matches(s.labels, m)));
}

const key = (l: Labels) => Object.keys(l).sort().map((k) => `${k}=${l[k]}`).join(",");
const without = (l: Labels, drop: string[]): Labels =>
  Object.fromEntries(Object.entries(l).filter(([k]) => !drop.includes(k)));
const only = (l: Labels, keep: string[]): Labels =>
  Object.fromEntries(Object.entries(l).filter(([k]) => keep.includes(k)));
const noName = (l: Labels) => without(l, ["__name__"]);

function scalarArg(n: Node | undefined, fn: string): number {
  if (!n || n.t !== "num") throw new PromQLError(`${fn}() espera um número no primeiro argumento.`);
  return n.v;
}

/** Aumento total do counter na janela, somando só as variações positivas (um reset conta o valor novo). */
function aumento(points: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const d = points[i][1] - points[i - 1][1];
    total += d >= 0 ? d : points[i][1];
  }
  return total;
}

function inclinacao(points: [number, number][]): number {
  const n = points.length;
  const mx = points.reduce((a, p) => a + p[0], 0) / n;
  const my = points.reduce((a, p) => a + p[1], 0) / n;
  let num = 0, den = 0;
  for (const [x, y] of points) { num += (x - mx) * (y - my); den += (x - mx) ** 2; }
  return den === 0 ? 0 : num / den;
}

function histogramQuantile(q: number, v: Sample[]): Sample[] {
  const groups = new Map<string, { labels: Labels; b: [number, number][] }>();
  for (const s of v) {
    if (s.labels.le === undefined) continue;
    const labels = without(s.labels, ["le", "__name__"]);
    const k = key(labels);
    const g = groups.get(k) ?? { labels, b: [] };
    g.b.push([s.labels.le === "+Inf" ? Infinity : Number(s.labels.le), s.value]);
    groups.set(k, g);
  }
  const out: Sample[] = [];
  for (const g of groups.values()) {
    const b = g.b.sort((x, y) => x[0] - y[0]);
    if (b.length < 2 || b[b.length - 1][0] !== Infinity) { out.push({ labels: g.labels, value: NaN }); continue; }
    const total = b[b.length - 1][1];
    if (total === 0) { out.push({ labels: g.labels, value: NaN }); continue; }
    const rank = q * total;
    const i = b.findIndex((x) => x[1] >= rank);
    if (i === b.length - 1) { out.push({ labels: g.labels, value: b[b.length - 2][0] }); continue; }
    if (i === 0 && b[0][0] <= 0) { out.push({ labels: g.labels, value: b[0][0] }); continue; }
    const lower = i === 0 ? 0 : b[i - 1][0];
    const prev = i === 0 ? 0 : b[i - 1][1];
    out.push({ labels: g.labels, value: lower + (b[i][0] - lower) * ((rank - prev) / (b[i][1] - prev)) });
  }
  return out;
}

function signature(l: Labels, m?: Matching): string {
  if (!m) return key(noName(l));
  return m.kind === "on" ? key(only(l, m.labels)) : key(without(l, ["__name__", ...m.labels]));
}

function arith(op: string, a: number, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
  }
  throw new PromQLError(`Operador "${op}" não suportado.`);
}

function compare(op: string, a: number, b: number): boolean {
  switch (op) {
    case "==": return a === b;
    case "!=": return a !== b;
    case ">": return a > b;
    case "<": return a < b;
    case ">=": return a >= b;
    case "<=": return a <= b;
  }
  return false;
}

const isCmp = (op: string) => ["==", "!=", ">", "<", ">=", "<="].includes(op);

function binary(node: Extract<Node, { t: "bin" }>, l: Value, r: Value): Value {
  if (l.t === "range" || r.t === "range") {
    throw new PromQLError("Operadores não se aplicam a vetores de intervalo; use rate() ou increase() antes.");
  }
  const { op } = node;
  if (op === "and") {
    if (l.t !== "vector" || r.t !== "vector") throw new PromQLError('"and" só funciona entre dois vetores.');
    const ks = new Set(r.s.map((s) => signature(s.labels, node.matching)));
    return { t: "vector", s: l.s.filter((s) => ks.has(signature(s.labels, node.matching))) };
  }
  if (l.t === "scalar" && r.t === "scalar") {
    if (isCmp(op)) {
      if (!node.bool) throw new PromQLError("Comparar dois números exige o modificador bool.");
      return { t: "scalar", v: compare(op, l.v, r.v) ? 1 : 0 };
    }
    return { t: "scalar", v: arith(op, l.v, r.v) };
  }
  if (l.t === "vector" && r.t === "scalar") return { t: "vector", s: vecScalar(node, l.s, r.v, false) };
  if (l.t === "scalar" && r.t === "vector") return { t: "vector", s: vecScalar(node, r.s, l.v, true) };
  if (l.t !== "vector" || r.t !== "vector") throw new PromQLError("Operandos inválidos.");

  const right = new Map<string, Sample>();
  for (const s of r.s) {
    const k = signature(s.labels, node.matching);
    if (right.has(k)) {
      throw new PromQLError(
        "Mais de uma série do lado direito casa com a mesma série do lado esquerdo. Agrupe antes (sum by) ou use on()/ignoring().",
      );
    }
    right.set(k, s);
  }
  const seen = new Set<string>();
  const out: Sample[] = [];
  for (const a of l.s) {
    const k = signature(a.labels, node.matching);
    const b = right.get(k);
    if (!b) continue;
    if (seen.has(k)) {
      throw new PromQLError(
        "Mais de uma série do lado esquerdo casa com a mesma série do lado direito. Agrupe antes (sum by) ou use on()/ignoring().",
      );
    }
    seen.add(k);
    const labels = !node.matching
      ? noName(a.labels)
      : node.matching.kind === "on" ? only(a.labels, node.matching.labels) : without(a.labels, ["__name__", ...node.matching.labels]);
    if (isCmp(op)) {
      if (node.bool) out.push({ labels, value: compare(op, a.value, b.value) ? 1 : 0 });
      else if (compare(op, a.value, b.value)) out.push({ labels: a.labels, value: a.value });
    } else {
      out.push({ labels, value: arith(op, a.value, b.value) });
    }
  }
  return { t: "vector", s: out };
}

function vecScalar(node: Extract<Node, { t: "bin" }>, v: Sample[], n: number, scalarLeft: boolean): Sample[] {
  const out: Sample[] = [];
  for (const s of v) {
    const [a, b] = scalarLeft ? [n, s.value] : [s.value, n];
    if (isCmp(node.op)) {
      if (node.bool) out.push({ labels: noName(s.labels), value: compare(node.op, a, b) ? 1 : 0 });
      else if (compare(node.op, a, b)) out.push({ labels: s.labels, value: s.value });
    } else {
      out.push({ labels: noName(s.labels), value: arith(node.op, a, b) });
    }
  }
  return out;
}

function aggregate(node: Extract<Node, { t: "agg" }>, v: Value): Value {
  if (v.t !== "vector") throw new PromQLError(`${node.op}() espera um vetor instantâneo; aplique rate() ao intervalo antes.`);
  const groupLabels = (l: Labels): Labels =>
    node.by ? only(l, node.by) : node.without ? without(l, ["__name__", ...node.without]) : {};
  const groups = new Map<string, { labels: Labels; items: Sample[] }>();
  for (const s of v.s) {
    const labels = groupLabels(s.labels);
    const k = key(labels);
    const g = groups.get(k) ?? { labels, items: [] };
    g.items.push(s);
    groups.set(k, g);
  }
  if (node.op === "topk") {
    const k = scalarArg(node.param, "topk");
    const out: Sample[] = [];
    for (const g of groups.values()) {
      out.push(...[...g.items].sort((a, b) => b.value - a.value).slice(0, k));
    }
    return { t: "vector", s: out };
  }
  const out: Sample[] = [];
  for (const g of groups.values()) {
    const vals = g.items.map((s) => s.value);
    let value: number;
    switch (node.op) {
      case "sum": value = vals.reduce((a, b) => a + b, 0); break;
      case "avg": value = vals.reduce((a, b) => a + b, 0) / vals.length; break;
      case "min": value = Math.min(...vals); break;
      case "max": value = Math.max(...vals); break;
      case "count": value = vals.length; break;
      default: throw new PromQLError(`Agregação "${node.op}" não suportada.`);
    }
    out.push({ labels: g.labels, value });
  }
  return { t: "vector", s: out };
}

export function evaluate(node: Node, at = NOW, data: Series[] = loja()): Value {
  const ev = (n: Node) => evaluate(n, at, data);
  switch (node.t) {
    case "num":
      return { t: "scalar", v: node.v };
    case "sel": {
      const t = at - (node.offsetSec ?? 0);
      const found = select(data, node);
      if (node.rangeSec !== undefined) {
        const s = found
          .map((x) => ({ labels: x.labels, points: x.points.filter(([ts]) => ts >= t - node.rangeSec! && ts <= t) }))
          .filter((x) => x.points.length > 0);
        return { t: "range", s, rangeSec: node.rangeSec };
      }
      const s: Sample[] = [];
      for (const x of found) {
        const vis = x.points.filter(([ts]) => ts <= t && ts > t - LOOKBACK);
        if (vis.length) s.push({ labels: x.labels, value: vis[vis.length - 1][1] });
      }
      return { t: "vector", s };
    }
    case "call": {
      const { fn, args } = node;
      if (fn === "rate" || fn === "increase" || fn === "deriv") {
        if (args.length !== 1) throw new PromQLError(`${fn}() recebe um único argumento.`);
        const r = ev(args[0]);
        if (r.t !== "range") throw new PromQLError(`${fn}() espera um vetor de intervalo, como metrica[5m].`);
        const s: Sample[] = [];
        for (const x of r.s) {
          if (x.points.length < 2) continue;
          const span = x.points[x.points.length - 1][0] - x.points[0][0];
          const labels = noName(x.labels);
          if (fn === "deriv") s.push({ labels, value: inclinacao(x.points) });
          else {
            const perSec = aumento(x.points) / span;
            s.push({ labels, value: fn === "rate" ? perSec : perSec * r.rangeSec });
          }
        }
        return { t: "vector", s };
      }
      if (fn === "histogram_quantile") {
        if (args.length !== 2) throw new PromQLError("histogram_quantile(φ, buckets) recebe dois argumentos.");
        const q = scalarArg(args[0], "histogram_quantile");
        const v = ev(args[1]);
        if (v.t !== "vector") throw new PromQLError("histogram_quantile() espera um vetor com os buckets (use rate sobre _bucket).");
        return { t: "vector", s: histogramQuantile(q, v.s) };
      }
      if (fn === "abs" || fn === "round") {
        const v = ev(args[0]);
        if (v.t === "scalar") return { t: "scalar", v: fn === "abs" ? Math.abs(v.v) : Math.round(v.v) };
        if (v.t !== "vector") throw new PromQLError(`${fn}() espera um vetor instantâneo.`);
        const f = fn === "abs" ? Math.abs : Math.round;
        return { t: "vector", s: v.s.map((s) => ({ labels: noName(s.labels), value: f(s.value) })) };
      }
      throw new PromQLError(`A função "${fn}" não é suportada pelo playground.`);
    }
    case "agg":
      if (!AGG_OPS.has(node.op)) throw new PromQLError(`Agregação "${node.op}" não suportada.`);
      return aggregate(node, ev(node.expr));
    case "bin":
      return binary(node, ev(node.l), ev(node.r));
  }
}
