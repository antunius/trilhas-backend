import { describe, expect, it } from "vitest";
import { articleHref, categoryHref } from "./paths";

describe("articleHref", () => {
  it("builds a nested category/article path", () => {
    expect(articleHref({ categorySlug: "kafka", slug: "anatomia" })).toBe(
      "/category/kafka/anatomia",
    );
  });
});

describe("categoryHref", () => {
  it("builds a category path", () => {
    expect(categoryHref("arquitetura")).toBe("/category/arquitetura");
  });
});
