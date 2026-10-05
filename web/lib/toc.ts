import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function uniqueHeadingId(
  text: string,
  used: Map<string, number>,
): string {
  const base = slugify(text) || "section";
  const n = used.get(base) || 0;
  used.set(base, n + 1);
  return n === 0 ? base : `${base}-${n + 1}`;
}

/** Extract h2/h3 from markdown body (ignores code fences). */
export function extractToc(markdown: string): TocHeading[] {
  const lines = markdown.split("\n");
  const headings: TocHeading[] = [];
  const used = new Map<string, number>();
  let inFence = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].replace(/#+\s*$/, "").trim();
    if (!text) continue;
    const id = uniqueHeadingId(text, used);
    headings.push({ id, text, level });
  }
  return headings;
}

/**
 * Remark plugin: stamp stable ids onto h2/h3 during parse (not during React
 * render). Avoids Strict Mode double-invoke mutating a heading cursor and
 * causing hydration mismatches on `id`.
 *
 * Usage: remarkPlugins={[remarkGfm, remarkHeadingIds(tocSlice)]}
 */
export function remarkHeadingIds(headings?: TocHeading[]) {
  return function remarkHeadingIdsPlugin() {
    return (tree: Root) => {
      const used = new Map<string, number>();
      let i = 0;
      visit(tree, "heading", (node) => {
        if (node.depth !== 2 && node.depth !== 3) return;
        const text = toString(node).trim();
        const fromToc = headings?.[i];
        const id =
          fromToc && fromToc.level === node.depth
            ? fromToc.id
            : uniqueHeadingId(text, used);
        i += 1;
        const data = node.data ?? (node.data = {});
        const props = (data.hProperties ?? (data.hProperties = {})) as Record<
          string,
          unknown
        >;
        props.id = id;
      });
    };
  };
}
