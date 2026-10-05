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
import { CourseSections } from "@/components/CourseSections";
import { PracticeStatsPanel } from "@/components/PracticeStatsPanel";

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
  bankSlugs = [],
}: {
  category: Category;
  articles: ArticleMeta[];
  quizCount: number;
  bankSlugs?: string[];
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

      <PracticeStatsPanel categorySlug={category.slug} bankSlugs={bankSlugs} />

      <CourseSections sections={sections} articles={articles} />
    </div>
  );
}
