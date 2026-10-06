import { PromQLError } from "./types";

export type MatchOp = "=" | "!=" | "=~" | "!~";
export type Matcher = { name: string; op: MatchOp; value: string };

export type Matching = { kind: "on" | "ignoring"; labels: string[] };

export type Node =
  | { t: "num"; v: number }
  | { t: "sel"; name?: string; matchers: Matcher[]; rangeSec?: number; offsetSec?: number }
  | { t: "call"; fn: string; args: Node[] }
  | { t: "agg"; op: string; param?: Node; by?: string[]; without?: string[]; expr: Node }
  | { t: "bin"; op: string; l: Node; r: Node; bool?: boolean; matching?: Matching };

export const AGG_OPS = new Set(["sum", "avg", "min", "max", "count", "topk"]);
export const FUNCS = new Set(["rate", "increase", "deriv", "histogram_quantile", "abs", "round"]);

type Tok = { k: "num" | "dur" | "id" | "str" | "op"; s: string; pos: number };

const DUR_UNIT: Record<string, number> = { ms: 0.001, s: 1, m: 60, h: 3600, d: 86400, w: 604800 };

export function parseDuration(s: string): number {
  let total = 0;
  for (const m of s.matchAll(/(\d+)(ms|s|m|h|d|w)/g)) total += Number(m[1]) * DUR_UNIT[m[2]];
  return total;
}

function lex(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    const ws = /^\s+/.exec(rest);
    if (ws) { i += ws[0].length; continue; }
    let m: RegExpExecArray | null;
    if ((m = /^(\d+(?:ms|s|m|h|d|w))+/.exec(rest))) toks.push({ k: "dur", s: m[0], pos: i });
    else if ((m = /^\d+(\.\d+)?/.exec(rest))) toks.push({ k: "num", s: m[0], pos: i });
    else if ((m = /^[A-Za-z_:][A-Za-z0-9_:]*/.exec(rest))) toks.push({ k: "id", s: m[0], pos: i });
    else if ((m = /^"((?:[^"\\]|\\.)*)"/.exec(rest)) || (m = /^'((?:[^'\\]|\\.)*)'/.exec(rest))) {
      toks.push({ k: "str", s: m[1].replace(/\\(.)/g, "$1"), pos: i });
    } else if ((m = /^(==|!=|=~|!~|>=|<=|[><=+\-*\/{}()\[\],])/.exec(rest))) toks.push({ k: "op", s: m[0], pos: i });
    else throw new PromQLError(`Erro de sintaxe na posição ${i + 1}: caractere inesperado "${rest[0]}".`);
    i += m![0].length;
  }
  return toks;
}

const CMP = new Set(["==", "!=", ">", "<", ">=", "<="]);

export function parse(src: string): Node {
  if (!src.trim()) throw new PromQLError("Digite uma consulta.");
  const toks = lex(src);
  let p = 0;
  const peek = () => toks[p];
  const fail = (msg: string): never => {
    const t = toks[p];
    const pos = t ? t.pos + 1 : src.length + 1;
    throw new PromQLError(`Erro de sintaxe na posição ${pos}: ${msg}`);
  };
  const isOp = (s: string) => peek()?.k === "op" && peek().s === s;
  const isId = (s: string) => peek()?.k === "id" && peek().s === s;
  const expectOp = (s: string) => {
    if (!isOp(s)) fail(`esperado "${s}"${peek() ? `, encontrado "${peek().s}"` : ", mas a consulta terminou"}.`);
    p++;
  };

  function labelList(): string[] {
    expectOp("(");
    const out: string[] = [];
    while (!isOp(")")) {
      const t = peek();
      if (!t || t.k !== "id") fail("esperado o nome de um label.");
      out.push(t.s);
      p++;
      if (isOp(",")) p++;
      else if (!isOp(")")) fail('esperado "," ou ")".');
    }
    expectOp(")");
    return out;
  }

  function parseAnd(): Node {
    let l = parseCmp();
    while (isId("and")) {
      p++;
      const matching = parseMatching();
      l = { t: "bin", op: "and", l, r: parseCmp(), matching };
    }
    if (isId("or") || isId("unless")) fail(`o operador "${peek().s}" não é suportado pelo playground.`);
    return l;
  }

  function parseMatching(): Matching | undefined {
    if (isId("on") || isId("ignoring")) {
      const kind = peek().s as "on" | "ignoring";
      p++;
      const labels = labelList();
      if (isId("group_left") || isId("group_right")) fail("group_left/group_right não são suportados pelo playground.");
      return { kind, labels };
    }
    return undefined;
  }

  function parseCmp(): Node {
    let l = parseAdd();
    while (peek()?.k === "op" && CMP.has(peek().s)) {
      const op = peek().s;
      p++;
      let bool = false;
      if (isId("bool")) { bool = true; p++; }
      const matching = parseMatching();
      l = { t: "bin", op, l, r: parseAdd(), bool, matching };
    }
    return l;
  }

  function parseAdd(): Node {
    let l = parseMul();
    while (isOp("+") || isOp("-")) {
      const op = peek().s;
      p++;
      const matching = parseMatching();
      l = { t: "bin", op, l, r: parseMul(), matching };
    }
    return l;
  }

  function parseMul(): Node {
    let l = parseUnary();
    while (isOp("*") || isOp("/")) {
      const op = peek().s;
      p++;
      const matching = parseMatching();
      l = { t: "bin", op, l, r: parseUnary(), matching };
    }
    return l;
  }

  function parseUnary(): Node {
    if (isOp("-")) {
      p++;
      return { t: "bin", op: "*", l: { t: "num", v: -1 }, r: parseUnary() };
    }
    if (isOp("+")) { p++; return parseUnary(); }
    return parsePrimary();
  }

  function parseMatchers(): Matcher[] {
    expectOp("{");
    const out: Matcher[] = [];
    while (!isOp("}")) {
      const n = peek();
      if (!n || n.k !== "id") fail("esperado o nome de um label.");
      p++;
      const o = peek();
      if (!o || o.k !== "op" || !["=", "!=", "=~", "!~"].includes(o.s)) fail('esperado um operador de label: =, !=, =~ ou !~.');
      p++;
      const v = peek();
      if (!v || v.k !== "str") fail('o valor do label deve estar entre aspas, como "500".');
      p++;
      out.push({ name: n.s, op: o.s as MatchOp, value: v.s });
      if (isOp(",")) p++;
      else if (!isOp("}")) fail('esperado "," ou "}".');
    }
    expectOp("}");
    return out;
  }

  function parseSelectorTail(sel: Extract<Node, { t: "sel" }>): Node {
    if (isOp("[")) {
      p++;
      const d = peek();
      if (!d || d.k !== "dur") fail("esperado uma duração, como 5m.");
      sel.rangeSec = parseDuration(d.s);
      p++;
      expectOp("]");
    }
    if (isId("offset")) {
      p++;
      const d = peek();
      if (!d || d.k !== "dur") fail("esperado uma duração depois de offset, como 30m.");
      sel.offsetSec = parseDuration(d.s);
      p++;
    }
    return sel;
  }

  function parsePrimary(): Node {
    const t = peek();
    if (!t) return fail("a consulta terminou antes do esperado.");
    if (t.k === "num") { p++; return { t: "num", v: Number(t.s) }; }
    if (t.k === "op" && t.s === "(") {
      p++;
      const e = parseAnd();
      expectOp(")");
      return e;
    }
    if (t.k === "op" && t.s === "{") {
      return parseSelectorTail({ t: "sel", matchers: parseMatchers() });
    }
    if (t.k === "id") {
      const name = t.s;
      if (AGG_OPS.has(name)) return parseAgg();
      if (peek() && toks[p + 1]?.k === "op" && toks[p + 1].s === "(") {
        if (!FUNCS.has(name)) fail(`a função "${name}" não é suportada pelo playground.`);
        p += 2;
        const args: Node[] = [];
        while (!isOp(")")) {
          args.push(parseAnd());
          if (isOp(",")) p++;
          else if (!isOp(")")) fail('esperado "," ou ")".');
        }
        expectOp(")");
        return { t: "call", fn: name, args };
      }
      p++;
      const matchers = isOp("{") ? parseMatchers() : [];
      return parseSelectorTail({ t: "sel", name, matchers });
    }
    return fail(`token inesperado "${t.s}".`);
  }

  function parseAgg(): Node {
    const op = peek().s;
    p++;
    let by: string[] | undefined;
    let without: string[] | undefined;
    if (isId("by")) { p++; by = labelList(); }
    else if (isId("without")) { p++; without = labelList(); }
    expectOp("(");
    let param: Node | undefined;
    let expr = parseAnd();
    if (isOp(",")) {
      p++;
      param = expr;
      expr = parseAnd();
    }
    expectOp(")");
    if (!by && !without) {
      if (isId("by")) { p++; by = labelList(); }
      else if (isId("without")) { p++; without = labelList(); }
    }
    if (op === "topk" && !param) fail("topk precisa de dois argumentos: topk(3, expressão).");
    if (op !== "topk" && param) fail(`${op}() recebe um único argumento.`);
    return { t: "agg", op, param, by, without, expr };
  }

  const ast = parseAnd();
  if (p < toks.length) fail(`token inesperado "${toks[p].s}".`);
  return ast;
}
