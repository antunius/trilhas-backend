import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TreeVisualizer, layoutTree } from "./TreeVisualizer";

const props = {
  title: "teste",
  examples: [
    {
      id: "a",
      label: "3 nós",
      tree: [1, 2, 3],
      steps: [
        { current: 0, stack: ["dfs(1)"], caption: "começa na raiz" },
        { current: 1, visited: [0], stack: ["dfs(1)", "dfs(2)"], caption: "desce à esquerda" },
      ],
    },
  ],
};

afterEach(cleanup);

describe("layoutTree", () => {
  it("places nodes in-order and links parents to children", () => {
    const { nodes, edges } = layoutTree([1, 2, 3, null, 4]);
    expect(nodes.map((n) => n.label)).toEqual([2, 4, 1, 3]);
    expect([...edges].sort()).toEqual([[0, 1], [0, 2], [1, 4]]);
  });
});

describe("TreeVisualizer", () => {
  it("renders every node and the first step", () => {
    const { container } = render(<TreeVisualizer {...props} />);
    expect(container.querySelectorAll("[data-node]")).toHaveLength(3);
    expect(screen.getByText("começa na raiz")).toBeInTheDocument();
    expect(screen.getByText("dfs(1)")).toBeInTheDocument();
  });

  it("advances a step and shows the deeper call stack", () => {
    render(<TreeVisualizer {...props} />);
    fireEvent.click(screen.getByLabelText("Próximo passo"));
    expect(screen.getByText("desce à esquerda")).toBeInTheDocument();
    expect(screen.getByText("dfs(2)")).toBeInTheDocument();
  });
});
