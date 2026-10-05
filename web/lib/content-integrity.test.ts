import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCategories, listArticles } from "@/lib/articles";

const root = process.cwd();
const articles = listArticles();
const categories = getCategories();

describe("conteúdo: artigos e índice", () => {
  it("slugs são únicos dentro de cada categoria", () => {
    const seen = new Set<string>();
    for (const a of articles) {
      const key = `${a.categorySlug}/${a.slug}`;
      expect(seen.has(key), key).toBe(false);
      seen.add(key);
    }
  });

  it("index.json espelha o frontmatter dos .md", () => {
    const index = JSON.parse(
      fs.readFileSync(path.join(root, "content/articles/index.json"), "utf8"),
    ) as { slug: string; categorySlug: string; order: number; section?: string; file: string }[];
    const byFile = new Map(index.map((e) => [e.file, e]));
    expect(index.length).toBe(articles.length);
    for (const a of articles) {
      const e = byFile.get(a.file);
      expect(e, a.file).toBeDefined();
      expect([e!.slug, e!.categorySlug, e!.order, e!.section]).toEqual([
        a.slug,
        a.categorySlug,
        a.order,
        a.section,
      ]);
    }
  });

  it("toda seção usada existe na categoria", () => {
    for (const a of articles) {
      if (!a.section) continue;
      const cat = categories.find((c) => c.slug === a.categorySlug);
      const ids = (cat as unknown as { sections?: { id: string }[] }).sections?.map((s) => s.id) ?? [];
      expect(ids, `${a.categorySlug}/${a.slug}`).toContain(a.section);
    }
  });

  it("order é único dentro da categoria", () => {
    for (const cat of categories) {
      const orders = articles.filter((a) => a.categorySlug === cat.slug).map((a) => a.order);
      expect(new Set(orders).size, cat.slug).toBe(orders.length);
    }
  });
});

describe("conteúdo: bancos de questões", () => {
  const gatesDir = path.join(root, "data/gates");
  const manifest = JSON.parse(
    fs.readFileSync(path.join(gatesDir, "course-banks.json"), "utf8"),
  ) as Record<string, string[]>;

  const files = fs
    .readdirSync(gatesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      fs.readdirSync(path.join(gatesDir, d.name)).map((f) => ({
        track: d.name,
        slug: f.replace(/\.json$/, ""),
        file: path.join(gatesDir, d.name, f),
      })),
    );

  it("todo banco pertence a uma lição existente", () => {
    for (const f of files) {
      const found = articles.some((a) => a.categorySlug === f.track && a.slug === f.slug);
      expect(found, `${f.track}/${f.slug}`).toBe(true);
    }
  });

  it("manifesto e arquivos coincidem", () => {
    for (const [track, slugs] of Object.entries(manifest)) {
      const onDisk = files.filter((f) => f.track === track).map((f) => f.slug).sort();
      expect([...slugs].sort(), track).toEqual(onDisk);
    }
  });

  it("questões são válidas (a ∈ o, opções distintas, why preenchido)", () => {
    for (const f of files) {
      const { questions } = JSON.parse(fs.readFileSync(f.file, "utf8")) as {
        questions: { q: string; o: string[]; a: string | number; w: string }[];
      };
      expect(questions.length, f.slug).toBeGreaterThan(0);
      for (const q of questions) {
        const where = `${f.track}/${f.slug}`;
        expect(q.q?.trim(), where).toBeTruthy();
        expect(q.w?.trim(), where).toBeTruthy();
        expect(q.o.length, where).toBeGreaterThanOrEqual(2);
        expect(new Set(q.o).size, where).toBe(q.o.length);
        const ok = typeof q.a === "number" ? q.a < q.o.length : q.o.includes(q.a);
        expect(ok, `${where}: ${q.q}`).toBe(true);
      }
    }
  });
});

describe("conteúdo: blocos de visualizador", () => {
  const re = /```(visualizer|treeviz|graphviz|gridviz)\n([\s\S]*?)```/g;
  it("todo fence tem JSON válido com examples", () => {
    let count = 0;
    for (const a of articles) {
      const raw = fs.readFileSync(path.join(root, "content/articles", a.file), "utf8");
      for (const m of raw.matchAll(re)) {
        count++;
        let data: { examples?: unknown[] };
        try {
          data = JSON.parse(m[2]);
        } catch (e) {
          throw new Error(`${a.file}: JSON inválido em ${m[1]} (${e})`);
        }
        expect(Array.isArray(data.examples), `${a.file} ${m[1]}`).toBe(true);
      }
    }
    expect(count).toBeGreaterThan(0);
  });
});

describe("conteúdo: navegação anterior/próximo", () => {
  it("segue a ordem das seções, não só o order global", async () => {
    const { articleNeighbors } = await import("@/lib/articles");
    const code = articles.filter((a) => a.categorySlug === "code");
    const lastTp = code.filter((a) => a.section === "two-pointers").at(-1)!;
    const next = articleNeighbors("code", lastTp.slug).next;
    expect(next?.section).toBe("dfs");
    const lastDfs = code.filter((a) => a.section === "dfs").at(-1)!;
    expect(articleNeighbors("code", lastDfs.slug).next?.section).toBe("bfs");
  });
});

describe("conteúdo: System Design em unidades por assunto", () => {
  const sd = articles.filter((a) => a.categorySlug === "system-design");

  it("toda lição tem group", () => {
    for (const a of sd) expect(a.group?.trim(), a.slug).toBeTruthy();
  });

  it("as lições de uma unidade são contíguas dentro do módulo e a unidade tem de 2 a 7", () => {
    const sections = [...new Set(sd.map((a) => a.section))];
    for (const sec of sections) {
      const list = sd.filter((a) => a.section === sec).sort((x, y) => x.order - y.order);
      const seen: string[] = [];
      let run = 0;
      let current: string | undefined;
      for (const a of list) {
        if (a.group !== current) {
          if (current !== undefined) expect(run, `${sec}/${current}`).toBeGreaterThanOrEqual(2);
          expect(seen.includes(a.group!), `${sec}: "${a.group}" reaparece separado`).toBe(false);
          seen.push(a.group!);
          current = a.group;
          run = 0;
        }
        run++;
        expect(run, `${sec}/${current}`).toBeLessThanOrEqual(7);
      }
      expect(run, `${sec}/${current}`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("conteúdo: dicas das questões", () => {
  it("a dica não repete a opção correta nem a explicação", () => {
    const dir = path.join(root, "data/gates/system-design");
    for (const f of fs.readdirSync(dir)) {
      const { questions } = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as {
        questions: { o: string[]; a: number; w: string; h?: string }[];
      };
      for (const q of questions) {
        if (!q.h) continue;
        expect(q.h.trim().length, f).toBeGreaterThan(5);
        expect(q.h, f).not.toBe(q.o[q.a]);
        expect(q.h, f).not.toBe(q.w);
      }
    }
  });
});

describe("conteúdo: lições quebradas por tópico", () => {
  // unidades já divididas em lições curtas, cada uma com seu próprio banco
  const SPLIT_UNITS = [
    "PostgreSQL", "Cassandra e DynamoDB", "Redis", "Elasticsearch", "Kafka", "Flink", "ZooKeeper", "API Gateway", "Prometheus e Grafana",
    "Rede", "Design de API", "Bancos de dados", "Indexação", "Cache", "Sharding", "Consistent hashing",
    "Teorema CAP", "Filas e mensageria", "Números para saber",
  ];
  const lessons = articles.filter(
    (a) => a.categorySlug === "system-design" && SPLIT_UNITS.includes(a.group ?? ""),
  );

  it("cada unidade dividida tem de 2 a 7 lições", () => {
    for (const unit of SPLIT_UNITS) {
      const n = lessons.filter((a) => a.group === unit).length;
      expect(n, unit).toBeGreaterThanOrEqual(2);
      expect(n, unit).toBeLessThanOrEqual(7);
    }
  });

  it("cada lição é curta e tem pelo menos 4 questões próprias", () => {
    for (const a of lessons) {
      const raw = fs.readFileSync(path.join(root, "content/articles", a.file), "utf8");
      const words = raw.split("---").slice(2).join("---").split(/\s+/).filter(Boolean).length;
      expect(words, `${a.slug} palavras`).toBeGreaterThanOrEqual(250);
      expect(words, `${a.slug} palavras`).toBeLessThanOrEqual(900);
      const bank = path.join(root, "data/gates/system-design", `${a.slug}.json`);
      expect(fs.existsSync(bank), `${a.slug} sem banco`).toBe(true);
      const { questions } = JSON.parse(fs.readFileSync(bank, "utf8")) as {
        questions: { h?: string; w: string }[];
      };
      expect(questions.length, `${a.slug} questões`).toBeGreaterThanOrEqual(4);
      for (const q of questions) {
        expect(q.h?.trim(), `${a.slug} dica`).toBeTruthy();
        expect(q.w.trim(), `${a.slug} explicação`).toBeTruthy();
      }
    }
  });
});

describe("conteúdo: redirects de System Design", () => {
  it("todo redirect de uma lição de System Design leva a uma página que existe", async () => {
    const { default: config } = await import("@/next.config");
    const redirects = await config.redirects!();
    const slugs = new Set(articles.filter((a) => a.categorySlug === "system-design").map((a) => a.slug));
    const prefix = "/category/system-design";
    const mine = redirects.filter(
      (r) => r.source.startsWith(`${prefix}/`) && r.destination.startsWith(prefix),
    );
    expect(mine.length).toBeGreaterThan(0);
    for (const r of mine) {
      const dest = r.destination.slice(prefix.length).replace(/^\//, "");
      if (dest === "") continue; // volta ao hub do curso
      expect(slugs.has(dest), `${r.source} -> ${r.destination}`).toBe(true);
    }
  });

  it("a página antiga do Kafka redireciona para a primeira lição", async () => {
    const { default: config } = await import("@/next.config");
    const redirects = await config.redirects!();
    const r = redirects.find((x) => x.source === "/category/system-design/kafka");
    expect(r?.destination).toBe("/category/system-design/kafka-visao-geral");
    expect(articles.some((a) => a.slug === "kafka" && a.categorySlug === "system-design")).toBe(false);
  });
});
