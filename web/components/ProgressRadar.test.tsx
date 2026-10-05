import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProgressRadar } from "./ProgressRadar";

describe("ProgressRadar", () => {
  it("renders nothing when there are fewer than 3 data points", () => {
    const { container } = render(
      <ProgressRadar data={[{ category: "Kafka", score: 80 }]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the chart wrapper when there are 3 or more data points", () => {
    const { container } = render(
      <ProgressRadar
        data={[
          { category: "Kafka", score: 80 },
          { category: "Sistemas Distribuídos", score: 60 },
          { category: "Concorrência", score: 45 },
        ]}
      />,
    );
    expect(container.querySelector(".radar-wrap")).toBeInTheDocument();
  });
});
