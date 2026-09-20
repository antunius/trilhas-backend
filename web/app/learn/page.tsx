import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
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
import { listArticles } from "@/lib/articles";
import { getPrimaryLearnCategories } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Learn",
  description:
    "Cursos: System Design, Code, Low Level Design, Behavioral, AI Coding e ML System Design.",
  path: "/learn",
});

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

export default function LearnPage() {
  const categories = getPrimaryLearnCategories();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-primary mb-2">
        Aprender
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
        Cursos
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
        Escolha um curso e avance seção a seção. No fim, valide com a Validation
        Matrix quando disponível.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Layers;
          const count = listArticles(cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
            >
              <div className="w-11 h-11 rounded-lg border border-primary/25 bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    {cat.name}
                    {cat.badge ? (
                      <span className="text-[10px] uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {cat.badge}
                      </span>
                    ) : null}
                  </h2>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.stub
                    ? "Em breve"
                    : `${count} artigo${count === 1 ? "" : "s"}`}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
