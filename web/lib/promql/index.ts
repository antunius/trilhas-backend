import { toResultado, type Resultado } from "./check";
import { NOW } from "./dataset";
import { evaluate } from "./eval";
import { parse } from "./parse";
import { PromQLError } from "./types";

export { compareResults, formatLabels, formatValue, type Resultado } from "./check";
export { PromQLError } from "./types";
export { NOW } from "./dataset";

/** Executa uma consulta PromQL (subconjunto) sobre os dados simulados da loja. */
export function runQuery(src: string, at = NOW): { ok: true; result: Resultado } | { ok: false; error: string } {
  try {
    return { ok: true, result: toResultado(evaluate(parse(src), at)) };
  } catch (e) {
    if (e instanceof PromQLError) return { ok: false, error: e.message };
    return { ok: false, error: "Não foi possível executar esta consulta." };
  }
}
