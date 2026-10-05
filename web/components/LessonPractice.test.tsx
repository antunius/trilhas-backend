import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { emptyPractice, type PracticeState } from "@/lib/practice";

let stored: PracticeState = emptyPractice();
vi.mock("@/lib/progress", () => ({
  isProgressHydrated: () => true,
  getPractice: () => stored,
  savePractice: (_: string, p: PracticeState) => {
    stored = p;
  },
}));
vi.mock("@/lib/practice", async (orig) => {
  const m = await orig<typeof import("@/lib/practice")>();
  // sem embaralhar, para o gabarito ser previsível
  return { ...m, shuffleOptions: (q: { o: string[]; a: number }) => ({ o: q.o, a: q.a }) };
});

import { LessonPractice } from "@/components/LessonPractice";

const questions = Array.from({ length: 5 }, (_, i) => ({
  q: `Pergunta ${i}`,
  o: ["certa", "errada 1", "errada 2"],
  a: 0,
  w: `Solução ${i}`,
  h: `Dica ${i}`,
}));

const responder = (opcao: string) => {
  fireEvent.click(screen.getByRole("radio", { name: opcao }));
  fireEvent.click(screen.getByRole("button", { name: "Conferir" }));
};

describe("LessonPractice", () => {
  afterEach(cleanup);
  beforeEach(() => {
    stored = emptyPractice();
  });

  it("não renderiza nada sem questões", () => {
    const { container } = render(<LessonPractice path="/x" questions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra a meta e só confere depois de escolher uma opção", () => {
    render(<LessonPractice path="/x" questions={questions} />);
    expect(screen.getByTestId("meta")).toHaveTextContent("0 de 3 acertos para concluir");
    expect(screen.getByRole("button", { name: "Conferir" })).toBeDisabled();
  });

  it("acerto mostra a solução e conta para a meta", () => {
    render(<LessonPractice path="/x" questions={questions} />);
    responder("certa");
    expect(screen.getByTestId("solucao")).toHaveTextContent("Correto.");
    expect(screen.getByTestId("meta")).toHaveTextContent("1 de 3 acertos");
    expect(stored.correct).toBe(1);
  });

  it("erro mostra 'Ainda não.' e guarda a questão para revisar", () => {
    render(<LessonPractice path="/x" questions={questions} />);
    responder("errada 1");
    expect(screen.getByTestId("solucao")).toHaveTextContent("Ainda não.");
    expect(stored.wrong).toHaveLength(1);
    expect(stored.correct).toBe(0);
  });

  it("dica aparece sem entregar a resposta e some depois de conferir", () => {
    render(<LessonPractice path="/x" questions={questions} />);
    fireEvent.click(screen.getByRole("button", { name: "Ver dica" }));
    expect(screen.getByText(/^Dica \d$/)).toBeInTheDocument();
    responder("certa");
    expect(screen.queryByText(/^Dica \d$/)).not.toBeInTheDocument();
  });

  it("pular traz outra questão sem contar resposta", () => {
    render(<LessonPractice path="/x" questions={questions} />);
    const antes = screen.getByRole("heading", { level: 3 }).textContent;
    fireEvent.click(screen.getByRole("button", { name: /Pular/ }));
    expect(screen.getByRole("heading", { level: 3 }).textContent).not.toBe(antes);
    expect(stored.answered).toBe(0);
  });

  it("conclui a lição ao chegar a 3 acertos", () => {
    render(<LessonPractice path="/x" questions={questions} />);
    for (let i = 0; i < 3; i++) {
      responder("certa");
      if (i < 2) fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
    }
    expect(screen.getByTestId("meta")).toHaveTextContent("Lição concluída, 3 acertos");
    expect(stored.done).toBe(true);
  });
});

describe("LessonPractice sem progresso carregado", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("mostra o título já na primeira renderização e as perguntas depois do tempo de espera", async () => {
    vi.resetModules();
    vi.doMock("@/lib/progress", () => ({
      isProgressHydrated: () => false,
      getPractice: () => emptyPractice(),
      savePractice: () => {},
    }));
    vi.useFakeTimers();
    const { LessonPractice: Fresh } = await import("@/components/LessonPractice");
    render(<Fresh path="/y" questions={questions} />);
    expect(screen.getByText("Pratique")).toBeInTheDocument();
    expect(screen.getByTestId("carregando")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
    expect(screen.getByRole("button", { name: "Conferir" })).toBeInTheDocument();
    vi.doUnmock("@/lib/progress");
  });
});
