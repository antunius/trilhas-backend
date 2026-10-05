"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ArticleMeta, CourseSection } from "@/types/content";
import { articleHref } from "@/lib/paths";
import { groupByUnit } from "@/lib/units";
import { useVisited } from "@/lib/use-visited";

const LEVEL_LABEL: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

/** Módulos do curso, cada um dividido em unidades por assunto, com lições lidas/total. */
export function CourseSections({
  sections,
  articles,
}: {
  sections: CourseSection[];
  articles: ArticleMeta[];
}) {
  const visited = useVisited();
  const readIn = (list: ArticleMeta[]) =>
    list.filter((a) => visited.has(articleHref(a))).length;

  let step = 0;
  return (
    <div className="space-y-10">
      {sections.map((sec) => {
        const items = articles
          .filter((a) => (a.section || "_") === sec.id)
          .sort((a, b) => a.order - b.order);
        const units = groupByUnit(items);
        return (
          <section key={sec.id} id={sec.id}>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="text-sm font-semibold text-foreground">{sec.name}</h2>
              {items.length > 0 ? (
                <span className="text-xs font-mono text-muted-foreground">
                  {readIn(items)} / {items.length} lições
                </span>
              ) : null}
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">
                Em breve — seção reservada no formato do curso.
              </p>
            ) : null}
            <div className="space-y-6 mt-3">
              {units.map((unit, ui) => (
                <div key={`${sec.id}-${ui}`}>
                  {unit.name ? (
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Unidade {ui + 1} · {unit.name}
                      </h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {readIn(unit.items)} / {unit.items.length}
                      </span>
                    </div>
                  ) : null}
                  <ol className="space-y-2">
                    {unit.items.map((a) => {
                      step += 1;
                      const done = visited.has(articleHref(a));
                      return (
                        <li key={a.slug}>
                          <Link
                            href={articleHref(a)}
                            className="flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/40 transition-colors"
                          >
                            <span
                              className={
                                "flex items-center justify-center w-8 h-8 rounded-full border text-xs font-mono shrink-0 " +
                                (done
                                  ? "border-green-500/60 text-green-500"
                                  : "border-border text-muted-foreground")
                              }
                            >
                              {step}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">{a.title}</div>
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
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
