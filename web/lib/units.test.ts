import { describe, expect, it } from "vitest";
import { groupByUnit } from "@/lib/units";
import type { ArticleMeta } from "@/types/content";

const a = (slug: string, group?: string) =>
  ({ slug, group, categorySlug: "c", title: slug, summary: "", level: "intermediario", order: 1, file: "" }) as ArticleMeta;

describe("groupByUnit", () => {
  it("agrupa itens contíguos com o mesmo group", () => {
    const u = groupByUnit([a("1", "A"), a("2", "A"), a("3", "B")]);
    expect(u.map((x) => [x.name, x.items.map((i) => i.slug)])).toEqual([
      ["A", ["1", "2"]],
      ["B", ["3"]],
    ]);
  });

  it("mantém lições sem group numa unidade sem nome", () => {
    const u = groupByUnit([a("1"), a("2")]);
    expect(u).toHaveLength(1);
    expect(u[0].name).toBeUndefined();
  });

  it("não funde grupos iguais separados por outro", () => {
    expect(groupByUnit([a("1", "A"), a("2", "B"), a("3", "A")])).toHaveLength(3);
  });
});
