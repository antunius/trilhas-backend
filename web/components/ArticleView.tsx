import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ArticleDoc, ArticleMeta, Category } from "@/types/content";
import { articleHref } from "@/lib/paths";
import { extractToc } from "@/lib/toc";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { MarkArticleRead } from "@/components/MarkArticleRead";
import { ArticleToc } from "@/components/ArticleToc";
import { LessonPractice } from "@/components/LessonPractice";
import type { GateQuestion } from "@/lib/gates";

export function ArticleView({
  category,
  article,
  prev,
  next,
  position,
  questions = [],
}: {
  category: Category;
  article: ArticleDoc;
  siblings: ArticleMeta[];
  prev?: ArticleMeta;
  next?: ArticleMeta;
  position?: { n: number; total: number };
  questions?: GateQuestion[];
}) {
  const toc = extractToc(article.body);

  return (
    <div className="pb-16">
      <MarkArticleRead
        path={`/category/${category.slug}/${article.slug}`}
        categorySlug={category.slug}
        articleSlug={article.slug}
      />

      <div
        className="border-b border-border"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.22), hsl(var(--secondary)) 50%, hsl(var(--primary) / 0.08))",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">
            {category.name}
            {article.section
              ? ` · ${
                  category.sections?.find((s) => s.id === article.section)
                    ?.name || article.section
                }`
              : ""}
            {article.group ? ` · ${article.group}` : ""}
          </p>
          {position ? (
            <p className="text-xs font-mono text-muted-foreground mb-3">
              Lição {position.n} de {position.total}
            </p>
          ) : null}
          <div className="inline-block rounded-xl border border-border/60 bg-background/90 backdrop-blur px-5 py-4 shadow-sm max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex gap-8 xl:gap-10 items-start justify-center">
          <div className="min-w-0 flex-1 max-w-3xl">
            <Link
              href={`/category/${category.slug}`}
              className="lg:hidden inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {category.name} Course
            </Link>

            {article.summary ? (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 pb-8 border-b border-border">
                {article.summary}
              </p>
            ) : null}

            <MarkdownRenderer content={article.body} headings={toc} />

            <LessonPractice
              key={article.slug}
              path={`/category/${category.slug}/${article.slug}`}
              questions={questions}
            />

            <nav
              className="mt-14 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3"
              aria-label="Navegação entre artigos"
            >
              {prev ? (
                <Link
                  href={articleHref(prev)}
                  className="group flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/40 transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Anterior
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {next ? (
                <Link
                  href={articleHref(next)}
                  className="group flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 hover:bg-primary/10 hover:border-primary/50 transition-colors sm:text-right sm:items-end"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                    Next: {next.title}
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {next.title}
                  </span>
                </Link>
              ) : category.hasQuiz ? (
                <Link
                  href={`/category/${category.slug}/quiz`}
                  className="group flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 hover:bg-primary/10 hover:border-primary/50 transition-colors sm:text-right sm:items-end sm:col-start-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                    Next: Avaliação
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Testar conhecimento desta categoria
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
            </nav>
          </div>

          <ArticleToc headings={toc} />
        </div>
      </div>
    </div>
  );
}
