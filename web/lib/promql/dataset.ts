import type { Series } from "./types";

/** Instante "agora" do conjunto de dados simulado, em segundos desde o início (1 hora de histórico). */
export const NOW = 3600;
const STEP = 15; // scrape_interval de 15 s

const BUCKETS = ["0.05", "0.1", "0.25", "0.5", "1", "+Inf"] as const;

/** Fração acumulada das requisições que cabem em cada bucket, por URI. */
const FRACOES: Record<string, number[]> = {
  "/pedidos": [0.3, 0.6, 0.85, 0.96, 0.995, 1],
  "/produtos": [0.7, 0.92, 0.99, 1, 1, 1],
  "/carrinho": [0.5, 0.8, 0.95, 0.99, 1, 1],
};
const MEDIA_S: Record<string, number> = { "/pedidos": 0.18, "/produtos": 0.06, "/carrinho": 0.09 };

type Linha = { method: string; uri: string; status: string; rate: Record<string, number> };

/** Requisições por segundo de cada rota, por instância. */
const TRAFEGO: Linha[] = [
  { method: "POST", uri: "/pedidos", status: "201", rate: { "pedidos-1": 80, "pedidos-2": 60 } },
  { method: "POST", uri: "/pedidos", status: "500", rate: { "pedidos-1": 2, "pedidos-2": 6 } },
  { method: "POST", uri: "/pedidos", status: "503", rate: { "pedidos-1": 1, "pedidos-2": 2 } },
  { method: "GET", uri: "/produtos", status: "200", rate: { "pedidos-1": 40, "pedidos-2": 30 } },
  { method: "POST", uri: "/carrinho", status: "200", rate: { "pedidos-1": 20, "pedidos-2": 15 } },
  { method: "POST", uri: "/carrinho", status: "500", rate: { "pedidos-1": 0.2, "pedidos-2": 0.4 } },
];

function tempos(): number[] {
  const out: number[] = [];
  for (let t = 0; t <= NOW; t += STEP) out.push(t);
  return out;
}

/** Dados determinísticos da loja online (sem aleatoriedade), no formato do Micrometer + Prometheus. */
export function buildLoja(): Series[] {
  const ts = tempos();
  const series: Series[] = [];
  for (const instance of ["pedidos-1", "pedidos-2"]) {
    for (const l of TRAFEGO) {
      const rate = l.rate[instance];
      const base = { application: "pedidos", instance, method: l.method, uri: l.uri, status: l.status };
      const count = (t: number) => Math.round(rate * (t + 600));
      series.push({
        labels: { __name__: "http_server_requests_seconds_count", ...base },
        points: ts.map((t) => [t, count(t)]),
      });
      series.push({
        labels: { __name__: "http_server_requests_seconds_sum", ...base },
        points: ts.map((t) => [t, Math.round(count(t) * MEDIA_S[l.uri] * 1000) / 1000]),
      });
      BUCKETS.forEach((le, i) => {
        series.push({
          labels: { __name__: "http_server_requests_seconds_bucket", ...base, le },
          points: ts.map((t) => [t, Math.round(count(t) * FRACOES[l.uri][i])]),
        });
      });
    }
    // fila de pagamentos: a de pedidos-1 cresce 0,25 item por segundo; a de pedidos-2 é estável
    series.push({
      labels: { __name__: "pagamentos_fila_tamanho", application: "pedidos", instance },
      points: ts.map((t) => [t, instance === "pedidos-1" ? 50 + t / 4 : 8]),
    });
  }
  for (const [instance, valor] of [["pedidos-1", 1], ["pedidos-2", 1], ["pedidos-3", 0]] as const) {
    series.push({
      labels: { __name__: "up", job: "pedidos", instance },
      points: ts.map((t) => [t, valor]),
    });
  }
  return series;
}

let cache: Series[] | null = null;
export function loja(): Series[] {
  return (cache ??= buildLoja());
}
