"use client";

import type { MouseEvent } from "react";
import type { TocHeading } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function ArticleToc({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) return null;

  function onClick(e: MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const url = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.replaceState(null, "", url);
  }

  return (
    <nav
      aria-label="Nesta página"
      className="hidden xl:block sticky top-24 self-start w-48 shrink-0"
    >
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
        Nesta página
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => onClick(e, h.id)}
              className={cn(
                "block text-sm text-muted-foreground hover:text-foreground transition-colors border-l-2 border-transparent -ml-px pl-3 py-0.5",
                h.level === 3 && "pl-5 text-xs",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
