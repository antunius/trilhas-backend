// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PromQLPlayground } from "./PromQLPlayground";

afterEach(cleanup);

const challenges = [
  {
    task: "Filtre só as requisições com status 500.",
    solution: 'http_server_requests_seconds_count{status="500"}',
    hint: "Use o operador = dentro das chaves.",
  },
  { task: "Some tudo.", solution: "sum(up)" },
];

function escrever(valor: string) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: valor } });
}

describe("PromQLPlayground", () => {
  it("aceita uma consulta equivalente e mostra a tabela", () => {
    render(<PromQLPlayground challenges={challenges} />);
    escrever('http_server_requests_seconds_count{status=~"500"}');
    fireEvent.click(screen.getByRole("button", { name: /Executar/ }));
    expect(screen.getByText(/Correto/)).toBeTruthy();
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText(/1 de 2 resolvidos|Todos/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Próximo desafio/ })).toBeTruthy();
  });

  it("mostra um desafio por vez e avança", () => {
    render(<PromQLPlayground challenges={challenges} />);
    expect(screen.getByText(/Filtre só as requisições/)).toBeTruthy();
    expect(screen.queryByText(/Some tudo/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Pular/ }));
    expect(screen.getByText(/Some tudo/)).toBeTruthy();
    expect(screen.getByText(/2 de 2/)).toBeTruthy();
  });

  it("explica a diferença quando erra", () => {
    render(<PromQLPlayground challenges={challenges} />);
    escrever("http_server_requests_seconds_count");
    fireEvent.click(screen.getByRole("button", { name: /Executar/ }));
    expect(screen.getByText(/Ainda não/)).toBeTruthy();
    expect(screen.getByText(/série\(s\)/)).toBeTruthy();
  });

  it("mostra erro de sintaxe com posição", () => {
    render(<PromQLPlayground challenges={challenges} />);
    escrever('http_server_requests_seconds_count{status=500}');
    fireEvent.click(screen.getByRole("button", { name: /Executar/ }));
    expect(screen.getByText(/entre aspas/)).toBeTruthy();
  });

  it("mostra a dica e a solução sob demanda", () => {
    render(<PromQLPlayground challenges={challenges} />);
    expect(screen.queryByText(/operador =/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Ver dica/ }));
    expect(screen.getByText(/operador =/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Ver solução/ }));
    expect(screen.getByText(challenges[0].solution)).toBeTruthy();
  });
});
