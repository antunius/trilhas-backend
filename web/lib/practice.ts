// Motor da prática dentro da lição: sem React, para poder ser testado.
import type { GateQuestion } from "@/lib/gates";

/** acertos para concluir uma lição (como na referência) */
export const LICAO_META = 3;

export type PracticeState = {
  answered: number;
  correct: number;
  /** índices (no banco) já mostrados nesta rodada */
  seen: number[];
  /** índices respondidos errado e ainda não acertados depois */
  wrong: number[];
  done: boolean;
};

export const emptyPractice = (): PracticeState => ({
  answered: 0,
  correct: 0,
  seen: [],
  wrong: [],
  done: false,
});

export const metaDe = (total: number) => Math.min(LICAO_META, total);

type Rng = () => number;

function pick<T>(list: T[], rng: Rng): T {
  return list[Math.floor(rng() * list.length)];
}

/**
 * Próxima questão: sorteia entre as ainda não vistas; quando o banco acaba,
 * recomeça a rodada por onde mais precisa (as erradas primeiro, depois todas),
 * sem repetir a que acabou de sair quando há alternativa.
 */
export function pickQuestion(
  total: number,
  state: PracticeState,
  rng: Rng = Math.random,
): { index: number; seen: number[] } {
  if (total <= 0) throw new Error("banco vazio");
  const all = Array.from({ length: total }, (_, i) => i);
  let seen = state.seen.filter((i) => i < total);
  let pool = all.filter((i) => !seen.includes(i));
  if (pool.length === 0) {
    const last = seen[seen.length - 1];
    seen = [];
    const wrong = state.wrong.filter((i) => i < total);
    pool = wrong.length ? wrong : all;
    if (pool.length > 1) pool = pool.filter((i) => i !== last);
  }
  const index = pick(pool, rng);
  return { index, seen: [...seen, index] };
}

/** Registra uma resposta e devolve o novo estado (a lição conclui na meta). */
export function recordAnswer(
  state: PracticeState,
  index: number,
  ok: boolean,
  total: number,
): PracticeState {
  const wrong = ok
    ? state.wrong.filter((i) => i !== index)
    : state.wrong.includes(index)
      ? state.wrong
      : [...state.wrong, index];
  const correct = state.correct + (ok ? 1 : 0);
  return {
    ...state,
    answered: state.answered + 1,
    correct,
    wrong,
    done: state.done || correct >= metaDe(total),
  };
}

/** Embaralha as opções e devolve o novo índice do gabarito. */
export function shuffleOptions(
  q: GateQuestion,
  rng: Rng = Math.random,
): { o: string[]; a: number } {
  const order = q.o.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { o: order.map((i) => q.o[i]), a: order.indexOf(q.a) };
}
