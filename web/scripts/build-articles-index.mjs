// Regenerates content/articles/index.json by scanning content/articles/**/*.md.
// Mirrors the metadata shape produced by lib/articles.ts (metaFromFile).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = path.join(process.cwd(), "content");
const articlesDir = path.join(root, "articles");

function walkMd(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMd(full, acc);
    else if (entry.name.endsWith(".md")) acc.push(full);
  }
  return acc;
}

function metaFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  if (!data.slug || !data.categorySlug || !data.title) return null;
  const rel = path.relative(articlesDir, filePath).replace(/\\/g, "/");
  const meta = {
    slug: String(data.slug),
    categorySlug: String(data.categorySlug),
    title: String(data.title),
    navTitle: data.navTitle ? String(data.navTitle) : undefined,
    summary: String(data.summary ?? ""),
    level: data.level || "intermediario",
    order: Number(data.order ?? 0),
    section: data.section ? String(data.section) : undefined,
    group: data.group ? String(data.group) : undefined,
    legacyPath: data.legacyPath ? String(data.legacyPath) : undefined,
    file: rel,
  };
  for (const key of Object.keys(meta)) {
    if (meta[key] === undefined) delete meta[key];
  }
  return meta;
}

const files = walkMd(articlesDir);
const metas = files.map(metaFromFile).filter(Boolean);
const sorted = metas.sort(
  (a, b) =>
    a.categorySlug.localeCompare(b.categorySlug) ||
    a.order - b.order ||
    a.slug.localeCompare(b.slug),
);

const indexPath = path.join(articlesDir, "index.json");
fs.writeFileSync(indexPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(`index.json: ${sorted.length} articles`);
