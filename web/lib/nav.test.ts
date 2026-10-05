import { describe, expect, it } from "vitest";
import {
  getLearnCategories,
  getNavSections,
  getPrimaryLearnCategories,
  getQuizCategories,
} from "./nav";

describe("getLearnCategories", () => {
  it("only returns learn-primary and learn-secondary categories, sorted by order", () => {
    const categories = getLearnCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const c of categories) {
      expect(["learn-primary", "learn-secondary"]).toContain(c.navGroup);
    }
    const orders = categories.map((c) => c.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
});

describe("getPrimaryLearnCategories", () => {
  it("is a subset of getLearnCategories restricted to learn-primary", () => {
    const primary = getPrimaryLearnCategories();
    expect(primary.length).toBeGreaterThan(0);
    expect(primary.every((c) => c.navGroup === "learn-primary")).toBe(true);
  });
});

describe("getQuizCategories", () => {
  it("only returns categories with hasQuiz set and not stubbed", () => {
    const quizCategories = getQuizCategories();
    for (const c of quizCategories) {
      expect(c.hasQuiz).toBe(true);
      expect(c.stub).toBeFalsy();
    }
  });
});

describe("getNavSections", () => {
  it("builds learn, practice and community sections", () => {
    const sections = getNavSections();
    expect(sections.map((s) => s.id)).toEqual(["learn", "practice", "community"]);

    const learn = sections.find((s) => s.id === "learn")!;
    expect(learn.links.length).toBe(getLearnCategories().length);

    const practice = sections.find((s) => s.id === "practice")!;
    expect(practice.links.at(-1)).toEqual({
      label: "Meu progresso",
      href: "/progress",
    });

    const community = sections.find((s) => s.id === "community")!;
    expect(community.links.map((l) => l.href)).toEqual([
      "/community",
      "/community#discord",
    ]);
  });

  it("marks the first learn-secondary link with a divider", () => {
    const learn = getNavSections().find((s) => s.id === "learn")!;
    const secondaryCount = getLearnCategories().filter(
      (c) => c.navGroup === "learn-secondary",
    ).length;
    if (secondaryCount > 0) {
      const firstSecondaryIndex =
        learn.links.length - secondaryCount;
      expect(learn.links[firstSecondaryIndex].dividerBefore).toBe(true);
    }
  });
});
