#!/usr/bin/env node
/**
 * Ingest interview course packs into content/articles + data/gates.
 *
 * Sources live outside the repo (Downloads). Run from web/:
 *   node scripts/ingest-courses.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const DOWNLOADS = path.resolve(WEB_ROOT, "..", ".."); // Downloads/files/web → Downloads
// Prefer sibling Downloads folders when web is at Downloads/files/web
const DOWNLOADS_ALT = path.resolve(WEB_ROOT, "../..");
const HOME_DOWNLOADS = "/Users/marcusantunius/Downloads";

function resolveDownloads() {
  for (const candidate of [HOME_DOWNLOADS, DOWNLOADS_ALT, DOWNLOADS]) {
    if (
      fs.existsSync(path.join(candidate, "curso-system-design 2")) ||
      fs.existsSync(path.join(candidate, "curso-system-design"))
    ) {
      return candidate;
    }
  }
  throw new Error("Could not find curso-system-design under Downloads");
}

const DL = resolveDownloads();
const ARTICLES_DIR = path.join(WEB_ROOT, "content/articles");
const GATES_DIR = path.join(WEB_ROOT, "data/gates");
const DIAGRAMS_DIR = path.join(WEB_ROOT, "public/diagrams");
const AMOSTRA = path.join(DL, "amostra-modulo5-progresso");
const SD_COURSE_DIR = fs.existsSync(path.join(DL, "curso-system-design 2"))
  ? "curso-system-design 2"
  : "curso-system-design";

const COURSES = [
  {
    dir: SD_COURSE_DIR,
    categorySlug: "system-design",
    modules: [
      { folder: "modulo-1-framework-entrega", section: "framework-entrega" },
      { folder: "modulo-2-tecnologias-chave", section: "tecnologias-chave" },
      { folder: "modulo-3-conceitos-centrais", section: "conceitos-centrais" },
      { folder: "modulo-4-exercicios-praticos", section: "exercicios-praticos" },
      { folder: "modulo-5-deep-dives-tecnologias", section: "deep-dives-tecnologias" },
      { folder: "modulo-6-padroes-recorrentes", section: "padroes-recorrentes" },
    ],
  },
  {
    dir: "curso-coding-dsa",
    categorySlug: "code",
    modules: [
      { folder: "modulo-1-fundamentos-entrevista", section: "fundamentals" },
      { folder: "modulo-2-padroes-essenciais", section: "patterns" },
      { folder: "modulo-3-reconhecendo-padrao", section: "pattern-recognition" },
      { folder: "modulo-4-exercicios-por-padrao", section: "practice" },
    ],
  },
  {
    dir: "curso-behavioral",
    categorySlug: "behavioral",
    modules: [
      { folder: "modulo-1-fundamentos", section: "fundamentals" },
      { folder: "modulo-2-catalogo-historias", section: "story-catalog" },
      { folder: "modulo-3-categorias-perguntas", section: "question-categories" },
      { folder: "modulo-4-pratica", section: "practice" },
    ],
  },
  {
    dir: "curso-ai-coding",
    categorySlug: "ai-coding",
    modules: [
      { folder: "modulo-1-fundamentos", section: "fundamentals" },
      { folder: "modulo-2-fluxo-trabalho", section: "workflow" },
      { folder: "modulo-3-armadilhas-comuns", section: "pitfalls" },
      { folder: "modulo-4-exercicio-pratico", section: "practice" },
    ],
  },
  {
    dir: "curso-ml-system-design",
    categorySlug: "ml-system-design",
    modules: [
      { folder: "modulo-1-framework-entrega", section: "framework" },
      { folder: "modulo-2-conceitos-centrais", section: "core-concepts" },
      { folder: "modulo-3-exercicios-praticos", section: "question-breakdowns" },
    ],
  },
];

/** Kafka only: pack 2 still has the thin lesson; amostra has the deep dive + diagrams */
const AMOSTRA_OVERRIDES = {
  "02-kafka.md": "02-kafka.md",
};

const LETTER_TO_INDEX = { A: 0, B: 1, C: 2, D: 3, E: 4 };

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function yamlEscape(s) {
  if (s.includes("\n") || s.includes(":") || s.includes('"') || s.includes("'")) {
    return JSON.stringify(s);
  }
  return s;
}

function cleanTitle(title) {
  // Drop "Módulo N — " / "Modulo N - " prefixes from overview H1s
  return title
    .replace(/^M[oó]dulo\s+\d+\s*[—–\-:]\s*/i, "")
    .trim();
}

/** Short sidebar label (Hello Interview–style). */
function navTitleFrom(title) {
  let t = cleanTitle(title);
  t = t.replace(/^\s*Exercício Guiado:\s*/i, "");
  t = t.replace(/^\s*Exercícios?:\s*/i, "");
  t = t.replace(/^\s*Deep Dive:\s*/i, "");
  // "Padrão: Escalando Leituras" → take the distinctive part after the label
  t = t.replace(/^\s*Padrão:\s*/i, "");
  t = t.replace(/^\s*Projetar\s+(um|uma)\s+/i, "");
  t = t.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  const colon = t.indexOf(":");
  if (colon > 0 && colon <= 40) {
    t = t.slice(0, colon).trim();
  }
  return t || title;
}

function extractTitle(raw) {
  const m = raw.match(/^#\s+(.+)$/m);
  return cleanTitle(m ? m[1].trim() : "Sem título");
}

function extractMeta(raw) {
  const modulo = raw.match(/\*\*Módulo:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  const duracao = raw.match(/\*\*Duração estimada:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  const formato = raw.match(/\*\*Formato:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
  return { modulo, duracao, formato };
}

function slugFromFile(fileName, moduleFolder) {
  const base = fileName.replace(/\.md$/, "");
  if (base === "00-visao-geral-modulo" || base.endsWith("visao-geral-modulo")) {
    const short = moduleFolder
      .replace(/^modulo-\d+-/, "")
      .replace(/[^a-z0-9-]+/gi, "-")
      .toLowerCase();
    return `${short}-overview`;
  }
  return base.replace(/^\d+-/, "");
}

function inferLevel(fileName, formato) {
  const f = (formato || "").toLowerCase();
  if (fileName.startsWith("00-") || fileName.includes("visao-geral")) {
    return "iniciante";
  }
  if (f.includes("exercício") || f.includes("exercicio") || fileName.includes("exercicio")) {
    return "avancado";
  }
  return "intermediario";
}

function buildSummary(body) {
  const objetivos = body.match(
    /## Objetivos[^\n]*\n+([\s\S]*?)(?=\n## |\n*$)/,
  );
  if (objetivos) {
    const firstBullet = objetivos[1].match(/-\s*\[[ x]\]\s*(.+)/i);
    if (firstBullet) return firstBullet[1].trim().slice(0, 220);
  }
  const conteudo = body.match(/## Conteúdo\n+([\s\S]*?)(?=\n## |\n*$)/);
  if (conteudo) {
    const para = conteudo[1]
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#") && !l.startsWith("-") && !l.startsWith("!"));
    if (para) return para.replace(/\*\*/g, "").slice(0, 220);
  }
  const firstPara = body
    .split("\n")
    .map((l) => l.trim())
    .find(
      (l) =>
        l &&
        !l.startsWith("#") &&
        !l.startsWith("**") &&
        !l.startsWith("-") &&
        !l.startsWith("!["),
    );
  return (firstPara || "").replace(/\*\*/g, "").slice(0, 220);
}

function extractQuiz(raw) {
  const quizMatch = raw.match(/## Quiz de fixação\s*\n([\s\S]*?)(?=\n\*[Ss]tatus:|\n*$)/);
  if (!quizMatch) return { questions: [], bodyWithoutQuiz: raw };

  const quizBlock = quizMatch[1];
  const bodyWithoutQuiz = raw
    .replace(/## Quiz de fixação\s*\n[\s\S]*?(?=\n\*[Ss]tatus:|\n*$)/, "")
    .trimEnd();

  const questions = [];
  const parts = quizBlock.split(/\*\*Pergunta\s+\d+:\*\*\s*/).slice(1);
  for (const part of parts) {
    const lines = part.trim().split("\n");
    const qLines = [];
    let i = 0;
    for (; i < lines.length; i++) {
      const line = lines[i];
      if (/^-\s*[A-E]\)/.test(line)) break;
      if (/^\*\*Resposta correta:\*\*/.test(line)) break;
      if (line.trim()) qLines.push(line.trim());
    }
    const q = qLines.join(" ").trim();
    const options = [];
    for (; i < lines.length; i++) {
      const m = lines[i].match(/^-\s*([A-E])\)\s*(.+)$/);
      if (m) {
        options.push(m[2].trim());
        continue;
      }
      if (/^\*\*Resposta correta:\*\*/.test(lines[i])) break;
      if (lines[i].trim() === "") continue;
      break;
    }
    const ansLine = lines.slice(i).find((l) => /^\*\*Resposta correta:\*\*/.test(l));
    const expLine = lines.slice(i).find((l) => /^\*\*Explicação:\*\*/.test(l));
    const letter = ansLine?.match(/\*\*Resposta correta:\*\*\s*([A-E])/i)?.[1]?.toUpperCase();
    const a = letter != null ? LETTER_TO_INDEX[letter] : 0;
    const w = expLine?.replace(/^\*\*Explicação:\*\*\s*/, "").trim() || "";
    if (q && options.length >= 2) {
      questions.push({ q, o: options, a: a ?? 0, w, t: "fixacao" });
    }
  }
  return { questions, bodyWithoutQuiz };
}

function cleanBody(raw) {
  let body = raw;
  // Drop H1 (title goes to frontmatter)
  body = body.replace(/^#\s+.+\n+/, "");
  // Drop bold meta lines
  body = body.replace(/^\*\*Módulo:\*\*.+\n?/gm, "");
  body = body.replace(/^\*\*Duração estimada:\*\*.+\n?/gm, "");
  body = body.replace(/^\*\*Formato:\*\*.+\n?/gm, "");
  // Drop status footer
  body = body.replace(/\n\*Status:[^*]*\*?\s*$/i, "");
  body = body.replace(/\n---\s*$/g, "");
  // Rewrite diagram paths
  body = body.replace(/\]\(diagramas\//g, "](/diagrams/");
  body = body.replace(/\]\(\.\/diagramas\//g, "](/diagrams/");
  return body.replace(/^\n+/, "").trim() + "\n";
}

function writeFrontmatter(
  { slug, categorySlug, title, navTitle, summary, level, order, section },
  body,
) {
  const navLine =
    navTitle && navTitle !== title
      ? `navTitle: ${yamlEscape(navTitle)}\n`
      : "";
  return `---
slug: ${slug}
categorySlug: ${categorySlug}
title: ${yamlEscape(title)}
${navLine}summary: ${yamlEscape(summary || title)}
level: ${level}
order: ${order}
section: ${section}
---

${body}`;
}

function copySvgsFrom(src, label) {
  if (!fs.existsSync(src)) {
    console.warn(`${label} diagrams folder missing:`, src);
    return 0;
  }
  ensureDir(DIAGRAMS_DIR);
  let n = 0;
  for (const name of fs.readdirSync(src)) {
    if (!name.endsWith(".svg")) continue;
    fs.copyFileSync(path.join(src, name), path.join(DIAGRAMS_DIR, name));
    n += 1;
  }
  return n;
}

function copyCourseDiagrams() {
  const m5Diagrams = path.join(
    DL,
    SD_COURSE_DIR,
    "modulo-5-deep-dives-tecnologias",
    "diagramas",
  );
  const fromPack = copySvgsFrom(m5Diagrams, "M5 pack");
  // Kafka diagrams still live only in the amostra
  const fromAmostra = copySvgsFrom(path.join(AMOSTRA, "diagramas"), "Amostra");
  return fromPack + fromAmostra;
}

function clearCategoryArticles(categorySlug) {
  const dir = path.join(ARTICLES_DIR, categorySlug);
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith(".md")) fs.unlinkSync(path.join(dir, name));
  }
}

function clearCategoryGates(categorySlug) {
  const dir = path.join(GATES_DIR, categorySlug);
  if (fs.existsSync(dir)) {
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".json")) fs.unlinkSync(path.join(dir, name));
    }
  }
  ensureDir(dir);
}

function rebuildIndex(allMetas) {
  const indexPath = path.join(ARTICLES_DIR, "index.json");
  const sorted = [...allMetas].sort(
    (a, b) =>
      a.categorySlug.localeCompare(b.categorySlug) ||
      a.order - b.order ||
      a.slug.localeCompare(b.slug),
  );
  fs.writeFileSync(indexPath, JSON.stringify(sorted, null, 2) + "\n");
  return sorted.length;
}

function ingestCourse(course) {
  const courseRoot = path.join(DL, course.dir);
  const outDir = path.join(ARTICLES_DIR, course.categorySlug);
  ensureDir(outDir);
  clearCategoryArticles(course.categorySlug);
  clearCategoryGates(course.categorySlug);

  const metas = [];
  const gateSlugs = [];
  let order = 0;

  for (const mod of course.modules) {
    const modDir = path.join(courseRoot, mod.folder);
    if (!fs.existsSync(modDir)) {
      console.warn("Missing module:", modDir);
      continue;
    }
    const files = fs
      .readdirSync(modDir)
      .filter((f) => f.endsWith(".md"))
      .filter((f) => !/^00-visao-geral/.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const file of files) {
      let srcPath = path.join(modDir, file);
      // Amostra override: Kafka deep dive (pack 2 still has the thin lesson)
      if (
        course.categorySlug === "system-design" &&
        mod.folder === "modulo-5-deep-dives-tecnologias" &&
        AMOSTRA_OVERRIDES[file]
      ) {
        const overridePath = path.join(AMOSTRA, AMOSTRA_OVERRIDES[file]);
        if (fs.existsSync(overridePath)) srcPath = overridePath;
      }

      const raw = fs.readFileSync(srcPath, "utf8");
      const title = extractTitle(raw);
      const meta = extractMeta(raw);
      const { questions, bodyWithoutQuiz } = extractQuiz(raw);
      const body = cleanBody(bodyWithoutQuiz);
      const slug = slugFromFile(file, mod.folder);
      const section =
        typeof mod.sectionFor === "function"
          ? mod.sectionFor(file)
          : mod.section;
      order += 1;
      const level = inferLevel(file, meta.formato);
      const summary = buildSummary(body);
      const navTitle = navTitleFrom(title);
      const doc = writeFrontmatter(
        {
          slug,
          categorySlug: course.categorySlug,
          title,
          navTitle,
          summary,
          level,
          order,
          section,
        },
        body,
      );
      const relFile = `${course.categorySlug}/${slug}.md`;
      fs.writeFileSync(path.join(outDir, `${slug}.md`), doc);

      metas.push({
        slug,
        categorySlug: course.categorySlug,
        title,
        navTitle,
        summary,
        level,
        order,
        section,
        file: relFile,
      });

      if (questions.length) {
        const gatePath = path.join(GATES_DIR, course.categorySlug, `${slug}.json`);
        fs.writeFileSync(
          gatePath,
          JSON.stringify({ questions }, null, 2) + "\n",
        );
        gateSlugs.push(slug);
      }
    }
  }

  return { metas, gateSlugs };
}

function main() {
  console.log("Downloads root:", DL);
  const diagrams = copyCourseDiagrams();
  console.log(`Copied ${diagrams} diagrams → public/diagrams`);
  console.log("SD source:", SD_COURSE_DIR);

  // Remove orphan article category folders that are no longer used
  const keep = new Set(COURSES.map((c) => c.categorySlug));
  if (fs.existsSync(ARTICLES_DIR)) {
    for (const name of fs.readdirSync(ARTICLES_DIR)) {
      const full = path.join(ARTICLES_DIR, name);
      if (!fs.statSync(full).isDirectory()) continue;
      if (!keep.has(name)) {
        // Leave other dirs (legacy) but clear only target categories via clearCategoryArticles
      }
    }
  }

  const allMetas = [];
  const bankManifest = {};

  for (const course of COURSES) {
    const { metas, gateSlugs } = ingestCourse(course);
    allMetas.push(...metas);
    bankManifest[course.categorySlug] = gateSlugs;
    console.log(
      `${course.categorySlug}: ${metas.length} articles, ${gateSlugs.length} quiz banks`,
    );
  }

  // Keep any articles outside the five categories (none expected)
  for (const name of fs.readdirSync(ARTICLES_DIR)) {
    const full = path.join(ARTICLES_DIR, name);
    if (!fs.statSync(full).isDirectory()) continue;
    if (keep.has(name)) continue;
    for (const f of fs.readdirSync(full)) {
      if (!f.endsWith(".md")) continue;
      // leave orphan categories; index rebuild only includes ingested + walk later
    }
  }

  const count = rebuildIndex(allMetas);
  const manifestPath = path.join(GATES_DIR, "course-banks.json");
  fs.writeFileSync(manifestPath, JSON.stringify(bankManifest, null, 2) + "\n");
  console.log(`index.json: ${count} articles`);
  console.log("Wrote", manifestPath);
}

main();
