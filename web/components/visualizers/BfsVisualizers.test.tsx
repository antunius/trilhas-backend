import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GraphVisualizer } from "./GraphVisualizer";
import { GridVisualizer } from "./GridVisualizer";
import { TreeVisualizer } from "./TreeVisualizer";

afterEach(cleanup);

describe("GraphVisualizer", () => {
  const props = {
    examples: [
      {
        id: "g",
        label: "triângulo",
        nodes: [{ id: 0, x: 40, y: 40 }, { id: 1, x: 140, y: 40 }, { id: 2, x: 90, y: 120 }],
        edges: [[0, 1], [1, 2]] as [number, number][],
        steps: [
          { current: 0, queue: ["0"], caption: "começa em 0" },
          { current: 1, visited: [0], frontier: [2], queue: ["1", "2"], caption: "visita 1" },
        ],
      },
    ],
  };

  it("renders nodes and edges, then shows the queue after stepping", () => {
    const { container } = render(<GraphVisualizer {...props} />);
    expect(container.querySelectorAll("[data-node]")).toHaveLength(3);
    expect(container.querySelectorAll("[data-edge]")).toHaveLength(2);
    fireEvent.click(screen.getByLabelText("Próximo passo"));
    expect(screen.getByText("visita 1")).toBeInTheDocument();
    expect(container.querySelector('[data-node="2"]')).toHaveAttribute("data-state", "frontier");
  });
});

describe("GridVisualizer", () => {
  const props = {
    examples: [
      {
        id: "g",
        label: "2x2",
        grid: [[".", "#"], [".", "."]],
        steps: [
          { current: [0, 0] as [number, number], queue: ["(0,0)"], caption: "início" },
          { current: [1, 0] as [number, number], visited: [[0, 0]] as [number, number][], values: { "0,0": 1 }, caption: "desce" },
        ],
      },
    ],
  };

  it("renders every cell, marks walls and advances a step", () => {
    const { container } = render(<GridVisualizer {...props} />);
    expect(container.querySelectorAll("[data-cell]")).toHaveLength(4);
    expect(container.querySelector('[data-cell="0,1"]')).toHaveAttribute("data-state", "wall");
    fireEvent.click(screen.getByLabelText("Próximo passo"));
    expect(screen.getByText("desce")).toBeInTheDocument();
    expect(container.querySelector('[data-cell="0,0"]')).toHaveTextContent("1");
  });
});

describe("TreeVisualizer queue", () => {
  it("shows the BFS queue when the step has one", () => {
    render(
      <TreeVisualizer
        examples={[{ id: "t", label: "t", tree: [1, 2, 3], steps: [{ current: 0, queue: ["2", "3"], caption: "nível 1" }] }]}
      />,
    );
    expect(screen.getByLabelText("Fila")).toHaveTextContent("23");
    expect(screen.queryByLabelText("Pilha de chamadas")).toBeNull();
  });
});
