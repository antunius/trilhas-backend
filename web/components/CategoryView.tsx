import Link from "next/link";
import {
  ChevronRight,
  Zap,
  Code2,
  Boxes,
  Network,
  Database,
  GitBranch,
  GitMerge,
  Layers,
  Brain,
  MessageSquare,
  BookOpen,
  Newspaper,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ArticleMeta, Category } from "@/types/content";
import { articleHref } from "@/lib/paths";

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Boxes,
  Network,
  Database,
  GitBranch,
  GitMerge,
  Layers,
  Brain,
  MessageSquare,
  BookOpen,
  Newspaper,
  Sparkles,
  Workflow,
};

const LEVEL_LABEL: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function CategoryView({
  category,
  articles,
  quizCount,
}: {
  category: Category;
  articles: ArticleMeta[];
  quizCount: number;
}) {
  const Icon = ICON_MAP[category.icon] || Layers;
  const sections = [...(category.sections || [])].sort(
    (a, b) => a.order - b.order,
  );

  if (category.stub) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="rounded-xl border border-dashed border-border bg-card px-5 py-8 text-center">
          <p className="font-medium text-foreground">Em breve</p>
          <p className="text-sm text-muted-foreground mt-1">
            Este curso ainda não tem artigos publicados.
          </p>
        </div>
      </div>
    );
  }

  const bySection = new Map<string, ArticleMeta[]>();
  for (const a of articles) {
    const key = a.section || "_";
    const list = bySection.get(key) || [];
    list.push(a);
    bySection.set(key, list);
  }

  let step = 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-primary mb-1">
            {category.name} Course
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {category.name}
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      {quizCount > 0 ? (
        <Link
          href={`/category/${category.slug}/quiz`}
          className="flex items-center gap-4 rounded-xl border border-primary/25 bg-primary/5 px-4 sm:px-5 py-4 mb-10 hover:bg-primary/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">Avaliação</div>
            <div className="text-sm text-muted-foreground">
              {quizCount} perguntas para testar seu conhecimento
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </Link>
      ) : null}

      <div className="space-y-8">
        {sections.map((sec) => {
          const items = bySection.get(sec.id) || [];
          return (
            <section key={sec.id} id={sec.id}>
              <h2 className="text-sm font-semibold text-foreground mb-1">
                {sec.name}
              </h2>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground mb-3">
                  Em breve — seção reservada no formato do curso.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mb-3">
                  {items.length} artigo{items.length === 1 ? "" : "s"}
                </p>
              )}
              {items.length > 0 ? (
                <ol className="space-y-2">
                  {items.map((a) => {
                    step += 1;
                    return (
                      <li key={a.slug}>
                        <Link
                          href={articleHref(a)}
                          className="flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/40 transition-colors"
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-xs font-mono text-muted-foreground shrink-0">
                            {step}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {a.title}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                              {a.summary}
                            </p>
                          </div>
                          <span className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-primary/30 text-primary shrink-0">
                            {LEVEL_LABEL[a.level] || a.level}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
