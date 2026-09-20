import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ArticleDoc, ArticleMeta, Category } from "@/types/content";

const root = path.join(process.cwd(), "content");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function getCategories(): Category[] {
  const cats = readJson<Category[]>(path.join(root, "categories.json"));
  return [...cats].sort((a, b) => a.order - b.order);
}

export function getCategory(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

function articlesDir() {
  return path.join(root, "articles");
}

function walkMd(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMd(full, acc);
    else if (entry.name.endsWith(".md")) acc.push(full);
  }
  return acc;
}

function metaFromFile(filePath: string): ArticleMeta | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  if (!data.slug || !data.categorySlug || !data.title) return null;
  const rel = path.relative(articlesDir(), filePath).replace(/\\/g, "/");
  return {
    slug: String(data.slug),
    categorySlug: String(data.categorySlug),
    title: String(data.title),
    navTitle: data.navTitle ? String(data.navTitle) : undefined,
    summary: String(data.summary ?? ""),
    level: (data.level as ArticleMeta["level"]) || "intermediario",
    order: Number(data.order ?? 0),
    section: data.section ? String(data.section) : undefined,
    group: data.group ? String(data.group) : undefined,
    legacyPath: data.legacyPath ? String(data.legacyPath) : undefined,
    file: rel,
  };
}

export function listArticles(categorySlug?: string): ArticleMeta[] {
  const files = walkMd(articlesDir());
  const metas = files
    .map(metaFromFile)
    .filter((m): m is ArticleMeta => Boolean(m))
    .filter((m) => (categorySlug ? m.categorySlug === categorySlug : true))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return metas;
}

export function getArticle(
  categorySlug: string,
  articleSlug: string,
): ArticleDoc | null {
  const meta = listArticles(categorySlug).find((a) => a.slug === articleSlug);
  if (!meta) return null;
  const full = path.join(articlesDir(), meta.file);
  if (!fs.existsSync(full)) return null;
  const { content } = matter(fs.readFileSync(full, "utf8"));
  return { ...meta, body: content.trim() };
}

export function findArticleByLegacyPath(legacyPath: string): ArticleMeta | null {
  return listArticles().find((a) => a.legacyPath === legacyPath) ?? null;
}

export { articleHref, categoryHref } from "@/lib/paths";

export function articleNeighbors(
  categorySlug: string,
  articleSlug: string,
): { prev?: ArticleMeta; next?: ArticleMeta } {
  const list = listArticles(categorySlug);
  const i = list.findIndex((a) => a.slug === articleSlug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i < list.length - 1 ? list[i + 1] : undefined,
  };
}
