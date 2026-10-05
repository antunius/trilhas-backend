import { describe, expect, it } from "vitest";
import {
  LICAO_META,
  emptyPractice,
  metaDe,
  pickQuestion,
  recordAnswer,
  shuffleOptions,
} from "@/lib/practice";

describe("pickQuestion", () => {
  it("não repete questão antes de esgotar o banco", () => {
    let state = emptyPractice();
    const vistas: number[] = [];
    for (let i = 0; i < 5; i++) {
      const { index, seen } = pickQuestion(5, state);
      vistas.push(index);
      state = { ...state, seen };
    }
    expect([...vistas].sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it("ao esgotar o banco recomeça pelas erradas, sem repetir a última", () => {
    const state = { ...emptyPractice(), seen: [0, 1, 2], wrong: [1, 2] };
    for (let i = 0; i < 30; i++) {
      const { index, seen } = pickQuestion(3, state, Math.random);
      expect([1, 2]).toContain(index);
      expect(index).not.toBe(2);
      expect(seen).toEqual([index]);
    }
  });

  it("com banco de uma questão só, devolve essa questão", () => {
    const state = { ...emptyPractice(), seen: [0] };
    expect(pickQuestion(1, state).index).toBe(0);
  });
});

describe("recordAnswer", () => {
  it("conclui a lição na meta de acertos", () => {
    let s = emptyPractice();
    for (let i = 0; i < LICAO_META - 1; i++) s = recordAnswer(s, i, true, 5);
    expect(s.done).toBe(false);
    s = recordAnswer(s, 4, true, 5);
    expect(s.done).toBe(true);
    expect(s.correct).toBe(LICAO_META);
  });

  it("guarda a errada e tira da lista quando acerta depois", () => {
    let s = recordAnswer(emptyPractice(), 2, false, 5);
    expect(s.wrong).toEqual([2]);
    s = recordAnswer(s, 2, true, 5);
    expect(s.wrong).toEqual([]);
    expect(s.answered).toBe(2);
  });

  it("a meta nunca passa do tamanho do banco", () => {
    expect(metaDe(2)).toBe(2);
    expect(recordAnswer(recordAnswer(emptyPractice(), 0, true, 2), 1, true, 2).done).toBe(true);
  });
});

describe("shuffleOptions", () => {
  it("mantém o gabarito apontando para a mesma opção", () => {
    const q = { q: "?", o: ["a", "b", "c", "d"], a: 2, w: "" };
    for (let i = 0; i < 50; i++) {
      const r = shuffleOptions(q);
      expect([...r.o].sort()).toEqual(["a", "b", "c", "d"]);
      expect(r.o[r.a]).toBe("c");
    }
  });
});
