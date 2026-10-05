"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import type { ArticleMeta, Category, CourseSection } from "@/types/content";
import { articleHref } from "@/lib/paths";
import { groupByUnit } from "@/lib/units";
import { useVisited } from "@/lib/use-visited";
import { cn } from "@/lib/utils";

function sectionArticles(
  sectionId: string,
  articles: ArticleMeta[],
): ArticleMeta[] {
  return articles
    .filter((a) => (a.section || "_") === sectionId)
    .sort((a, b) => a.order - b.order);
}

/** Hello Interview–style course sidebar: Back → course title → accordion sections. */
export function CourseOutline({
  category,
  articles,
  activeSlug,
  showQuiz,
  onNavigate,
}: {
  category: Category;
  articles: ArticleMeta[];
  activeSlug?: string;
  showQuiz?: boolean;
  onNavigate?: () => void;
}) {
  const sections: CourseSection[] = (
    category.sections?.length
      ? [...category.sections]
      : [{ id: "_", name: "Articles", order: 1 }]
  ).sort((a, b) => a.order - b.order);

  const activeSectionId =
    articles.find((a) => a.slug === activeSlug)?.section ||
    sections.find((s) => sectionArticles(s.id, articles).length > 0)?.id;

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const s of sections) {
      init[s.id] = s.id === activeSectionId;
    }
    if (!activeSectionId && sections[0]) init[sections[0].id] = true;
    return init;
  });

  useEffect(() => {
    if (!activeSectionId) return;
    setOpen((prev) => ({ ...prev, [activeSectionId]: true }));
  }, [activeSectionId]);

  const visited = useVisited();

  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({});
  function toggleUnit(key: string, current: boolean) {
    setOpenUnits((prev) => ({ ...prev, [key]: !current }));
  }

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <nav aria-label="Course outline" className="text-sm">
      <Link
        href="/learn"
        onClick={onNavigate}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Main
      </Link>

      <Link
        href={`/category/${category.slug}`}
        onClick={onNavigate}
        className="block font-semibold text-foreground hover:text-primary mb-4 leading-snug"
      >
        {category.name} Course
      </Link>

      <div className="space-y-1">
        {sections.map((sec) => {
          const items = sectionArticles(sec.id, articles);
          const isOpen = !!open[sec.id];
          const hasActive = items.some((a) => a.slug === activeSlug);
          const empty = items.length === 0;

          return (
            <div key={sec.id} className="border-b border-border/60 last:border-0 pb-1 mb-1">
              <button
                type="button"
                onClick={() => toggle(sec.id)}
                className={cn(
                  "flex w-full items-center gap-2 py-2 text-left font-medium transition-colors",
                  hasActive || isOpen
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-expanded={isOpen}
              >
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 shrink-0 transition-transform",
                    isOpen ? "rotate-0" : "-rotate-90",
                  )}
                />
                <span className="flex-1">{sec.name}</span>
                {!empty ? (
                  <span className="text-[10px] font-mono text-muted-foreground/80">
                    {items.filter((a) => visited.has(articleHref(a))).length}/{items.length}
                  </span>
                ) : null}
                {empty ? (
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                    Soon
                  </span>
                ) : null}
              </button>

              {isOpen ? (
                <ul className="ml-2 pl-3 border-l border-border space-y-0.5 pb-2">
                  {empty ? (
                    <li className="text-xs text-muted-foreground py-1.5 pl-2">
                      Em breve
                    </li>
                  ) : (
                    groupByUnit(items).map((unit, ui) => {
                      const key = `${sec.id}:${ui}`;
                      const hasActiveUnit = unit.items.some((a) => a.slug === activeSlug);
                      const unitOpen = !unit.name || (openUnits[key] ?? hasActiveUnit);
                      const read = unit.items.filter((a) => visited.has(articleHref(a))).length;
                      return (
                        <li key={key}>
                          {unit.name ? (
                            <button
                              type="button"
                              onClick={() => toggleUnit(key, unitOpen)}
                              aria-expanded={unitOpen}
                              className="mt-3 mb-1 flex w-full items-center gap-1.5 pl-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground"
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3 h-3 shrink-0 transition-transform",
                                  unitOpen ? "rotate-0" : "-rotate-90",
                                )}
                              />
                              <span className="flex-1">{unit.name}</span>
                              <span className="font-mono normal-case tracking-normal">
                                {read}/{unit.items.length}
                              </span>
                            </button>
                          ) : null}
                          {unitOpen ? (
                            <ul className="space-y-0.5">
                              {unit.items.map((a) => {
                                const active = a.slug === activeSlug;
                                const done = visited.has(articleHref(a));
                                return (
                                  <li key={a.slug}>
                                    <Link
                                      href={articleHref(a)}
                                      onClick={onNavigate}
                                      className={cn(
                                        "flex items-center gap-2 py-1.5 pl-2 -ml-px border-l-2 transition-colors leading-snug",
                                        active
                                          ? "border-primary text-primary font-medium"
                                          : "border-transparent text-muted-foreground hover:text-foreground",
                                      )}
                                    >
                                      <span
                                        aria-label={done ? "Concluído" : "Não lido"}
                                        className={cn(
                                          "h-2 w-2 shrink-0 rounded-full",
                                          done
                                            ? "bg-green-500"
                                            : "border border-muted-foreground/60",
                                        )}
                                      />
                                      <span>{a.navTitle || a.title}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })
                  )}
                </ul>
              ) : null}
            </div>
          );
        })}

        {showQuiz || category.hasQuiz ? (
          <Link
            href={`/category/${category.slug}/quiz`}
            onClick={onNavigate}
            className="flex items-center gap-2 py-2.5 text-muted-foreground hover:text-foreground font-medium"
          >
            Avaliação
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
