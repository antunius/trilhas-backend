import type { ArticleMeta } from "@/types/content";

export type Unit = { name?: string; items: ArticleMeta[] };

/** Agrupa lições já ordenadas em unidades contíguas pelo campo `group`. */
export function groupByUnit(items: ArticleMeta[]): Unit[] {
  const units: Unit[] = [];
  for (const a of items) {
    const last = units[units.length - 1];
    if (last && last.name === a.group) last.items.push(a);
    else units.push({ name: a.group, items: [a] });
  }
  return units;
}
