import { describe, expect, it } from "vitest";
import { compareResults, runQuery, type Resultado } from "./index";

function vec(q: string) {
  const r = runQuery(q);
  if (!r.ok) throw new Error(r.error);
  if (r.result.kind !== "vector") throw new Error("não é vetor");
  return r.result.series;
}
function scalar(q: string) {
  const r = runQuery(q);
  if (!r.ok || r.result.kind !== "scalar") throw new Error("não é escalar");
  return r.result.value;
}
const err = (q: string) => {
  const r = runQuery(q);
  if (r.ok) throw new Error("devia falhar");
  return r.error;
};

const C = "http_server_requests_seconds_count";

describe("PromQL: filtros de label", () => {
  it("= e != selecionam por igualdade", () => {
    expect(vec(`${C}{status="500"}`)).toHaveLength(4); // /pedidos e /carrinho, 2 instâncias
    expect(vec(`${C}{uri="/pedidos", status="500"}`)).toHaveLength(2);
    expect(vec(`${C}{uri!="/pedidos"}`)).toHaveLength(6);
  });
  it("=~ é ancorada: 5.. casa 500 e 503, mas 5 não casa nada", () => {
    expect(vec(`${C}{uri="/pedidos", status=~"5.."}`)).toHaveLength(4);
    expect(vec(`${C}{status=~"5"}`)).toHaveLength(0);
    expect(vec(`${C}{status=~"500|503"}`)).toHaveLength(vec(`${C}{status=~"5.."}`).length);
  });
  it("!~ exclui por regex", () => {
    expect(vec(`${C}{status!~"2.."}`)).toHaveLength(6);
  });
  it("label ausente equivale a vazio", () => {
    expect(vec(`${C}{job=""}`)).toHaveLength(vec(C).length);
    expect(vec(`${C}{job!=""}`)).toHaveLength(0);
  });
  it("{__name__=~...} seleciona por nome", () => {
    expect(vec(`{__name__=~"up|pagamentos_fila_tamanho"}`)).toHaveLength(5);
  });
});

describe("PromQL: funções e agregações", () => {
  it("rate de um counter linear devolve a taxa configurada", () => {
    const s = vec(`rate(${C}{uri="/pedidos", status="201"}[5m])`);
    expect(s.map((x) => x.value).sort()).toEqual([60, 80]);
    expect(Object.keys(s[0].labels)).not.toContain("__name__");
  });
  it("increase = rate × janela", () => {
    const s = vec(`increase(${C}{uri="/pedidos", status="201", instance="pedidos-1"}[1m])`);
    expect(s[0].value).toBeCloseTo(80 * 60, 6);
  });
  it("sum by e without agrupam", () => {
    const by = vec(`sum by (instance) (rate(${C}{uri="/pedidos"}[5m]))`);
    expect(by.find((x) => x.labels.instance === "pedidos-1")!.value).toBeCloseTo(83, 6);
    expect(by.find((x) => x.labels.instance === "pedidos-2")!.value).toBeCloseTo(68, 6);
    const wo = vec(`sum without (status, method, uri) (rate(${C}[5m]))`);
    expect(wo).toHaveLength(2);
    expect(wo[0].labels.application).toBe("pedidos");
  });
  it("taxa de sucesso = 2xx / total", () => {
    const v = scalar(`1 + 0`);
    expect(v).toBe(1);
    const s = vec(
      `sum(rate(${C}{uri="/pedidos", status=~"2.."}[5m])) / sum(rate(${C}{uri="/pedidos"}[5m]))`,
    );
    expect(s).toHaveLength(1);
    expect(s[0].value).toBeCloseTo(140 / 151, 6);
  });
  it("divisão por instância casa pelos labels", () => {
    const s = vec(
      `sum by (instance) (rate(${C}{uri="/pedidos", status=~"5.."}[5m])) / sum by (instance) (rate(${C}{uri="/pedidos"}[5m]))`,
    );
    expect(s.find((x) => x.labels.instance === "pedidos-1")!.value).toBeCloseTo(3 / 83, 6);
    expect(s.find((x) => x.labels.instance === "pedidos-2")!.value).toBeCloseTo(8 / 68, 6);
  });
  it("topk devolve as maiores séries", () => {
    const s = vec(`topk(2, sum by (uri) (rate(${C}[5m])))`);
    expect(s.map((x) => x.labels.uri)).toEqual(["/pedidos", "/produtos"]);
  });
  it("histogram_quantile interpola dentro do bucket", () => {
    const s = vec(
      `histogram_quantile(0.99, sum by (le) (rate(http_server_requests_seconds_bucket{uri="/pedidos"}[5m])))`,
    );
    // p99 cai entre 0,5 s (96%) e 1 s (99,5%): 0,5 + 0,5 × (0,99−0,96)/(0,995−0,96) ≈ 0,9286
    expect(s[0].value).toBeCloseTo(0.9286, 2);
  });
  it("deriv mede a inclinação da fila", () => {
    const s = vec(`deriv(pagamentos_fila_tamanho[10m])`);
    expect(s.find((x) => x.labels.instance === "pedidos-1")!.value).toBeCloseTo(0.25, 6);
    expect(s.find((x) => x.labels.instance === "pedidos-2")!.value).toBeCloseTo(0, 6);
    expect(vec(`deriv(pagamentos_fila_tamanho[10m]) > 0`)).toHaveLength(1);
  });
  it("up == 0 acha instâncias fora do ar", () => {
    expect(vec(`up == 0`).map((x) => x.labels.instance)).toEqual(["pedidos-3"]);
  });
  it("offset olha o passado", () => {
    const a = vec(`pagamentos_fila_tamanho{instance="pedidos-1"}`)[0].value;
    const b = vec(`pagamentos_fila_tamanho{instance="pedidos-1"} offset 30m`)[0].value;
    expect(a - b).toBeCloseTo(450, 6);
  });
  it("aritmética com escalar e bool", () => {
    expect(vec(`up * 100`).map((x) => x.value).sort()).toEqual([0, 100, 100]);
    expect(vec(`up == bool 1`).map((x) => x.value).sort()).toEqual([0, 1, 1]);
  });
});

describe("PromQL: erros", () => {
  it("sintaxe", () => {
    expect(err(`rate(${C}{status=500}[5m])`)).toMatch(/entre aspas/);
    expect(err(`sum(`)).toMatch(/posição/);
    expect(err(`${C}{status="500"`)).toMatch(/esperado/);
    expect(err(``)).toMatch(/consulta/);
  });
  it("tipos", () => {
    expect(err(`rate(${C})`)).toMatch(/intervalo/);
    expect(err(`sum(${C}[5m])`)).toMatch(/instantâneo/);
    expect(err(`absent(up)`)).toMatch(/não é suportada/);
    expect(err(`sum by (instance) (rate(${C}[5m])) / on() sum(rate(${C}[5m]))`)).toMatch(/Mais de uma série/);
  });
  it("vetor de intervalo cru é sinalizado no resultado", () => {
    const r = runQuery(`${C}[5m]`);
    expect(r.ok && r.result.kind).toBe("range");
  });
});

describe("compareResults", () => {
  const ok = (q: string) => {
    const r = runQuery(q);
    if (!r.ok) throw new Error(r.error);
    return r.result;
  };
  it("aceita consultas equivalentes", () => {
    const a = ok(`${C}{status=~"5.."}`);
    const b = ok(`${C}{status=~"500|503"}`);
    expect(compareResults(a, b).ok).toBe(true);
  });
  it("explica contagem, labels e valores diferentes", () => {
    const esperado = ok(`sum by (instance) (rate(${C}[5m]))`);
    expect(compareResults(esperado, ok(`rate(${C}[5m])`)).message).toMatch(/série\(s\)/);
    expect(compareResults(esperado, ok(`sum by (instance) (rate(${C}[5m])) * 2`)).message).toMatch(/Valores diferentes/);
    const outroLabel = ok(`sum by (application) (rate(${C}[5m]))`);
    expect(compareResults(esperado, outroLabel).message).toMatch(/série\(s\)/);
    const mesmoNumero = ok(`sum by (uri) (rate(${C}{instance="pedidos-1"}[5m]))`) as Resultado;
    expect(compareResults(ok(`sum by (status) (rate(${C}{instance="pedidos-1"}[5m]))`), mesmoNumero).ok).toBe(false);
  });
  it("sinaliza vetor de intervalo e tipos diferentes", () => {
    const esperado = ok(`rate(${C}[5m])`);
    expect(compareResults(esperado, ok(`${C}[5m]`)).message).toMatch(/rate\(\)/);
    expect(compareResults(esperado, ok(`1 + 1`)).ok).toBe(false);
  });
});
