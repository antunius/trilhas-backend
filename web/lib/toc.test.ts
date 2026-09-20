import { describe, expect, it } from "vitest";
import { extractToc, uniqueHeadingId } from "./toc";

describe("extractToc", () => {
  it("extracts h2 and h3 headings with slugified ids", () => {
    const md = "# Title\n\n## First Section\n\ntext\n\n### Sub Section\n";
    expect(extractToc(md)).toEqual([
      { id: "first-section", text: "First Section", level: 2 },
      { id: "sub-section", text: "Sub Section", level: 3 },
    ]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const md = "## Real Heading\n\n```\n## Not a heading\n```\n\n## Another\n";
    expect(extractToc(md)).toEqual([
      { id: "real-heading", text: "Real Heading", level: 2 },
      { id: "another", text: "Another", level: 2 },
    ]);
  });

  it("ignores h1 and h4+ headings", () => {
    const md = "# H1\n\n## H2\n\n#### H4\n";
    expect(extractToc(md)).toEqual([{ id: "h2", text: "H2", level: 2 }]);
  });

  it("dedupes repeated heading text with incrementing suffixes", () => {
    const md = "## Overview\n\n## Overview\n\n## Overview\n";
    expect(extractToc(md).map((h) => h.id)).toEqual([
      "overview",
      "overview-2",
      "overview-3",
    ]);
  });

  it("strips accents and punctuation when slugifying", () => {
    const md = "## Replicação & Ordenação!\n";
    expect(extractToc(md)[0].id).toBe("replicacao-ordenacao");
  });
});

describe("uniqueHeadingId", () => {
  it("returns the base slug on first use and increments on repeats", () => {
    const used = new Map<string, number>();
    expect(uniqueHeadingId("Cluster", used)).toBe("cluster");
    expect(uniqueHeadingId("Cluster", used)).toBe("cluster-2");
    expect(uniqueHeadingId("Cluster", used)).toBe("cluster-3");
  });

  it("falls back to 'section' for text with no sluggable characters", () => {
    const used = new Map<string, number>();
    expect(uniqueHeadingId("!!!", used)).toBe("section");
  });
});
