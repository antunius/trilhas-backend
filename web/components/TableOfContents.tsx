"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import type { SecaoBeat } from "@/lib/beats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TableOfContents({
  secoes,
  activeId,
}: {
  secoes: SecaoBeat[];
  activeId?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [activeId]);

  if (secoes.length === 0) return null;

  function goTo(id: string) {
    const el = document.getElementById(`beat-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  const list = (
    <nav aria-label="Seções deste capítulo" className="space-y-1">
      {secoes.map((s, i) => {
        const on = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(s.id)}
            className={`w-full text-left rounded-md px-2.5 py-2 text-xs leading-snug transition-colors ${
              on
                ? "bg-primary/10 text-foreground border border-primary/30 font-medium"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent"
            }`}
          >
            <span className="font-mono text-[10px] text-muted-foreground/80 mr-1.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s.title}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile dropdown */}
      <div className="lg:hidden mb-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 w-full justify-between"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4" />
            <span>Seções deste capítulo</span>
          </span>
          <Badge variant="outline" className="font-mono text-[10px]">
            {secoes.length}
          </Badge>
        </Button>
        {open ? (
          <div className="mt-2 p-2 rounded-xl border border-border/80 bg-card shadow-sm">
            {list}
          </div>
        ) : null}
      </div>

      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block sticky top-24 self-start w-52 shrink-0">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Neste capítulo
        </div>
        {list}
      </aside>
    </>
  );
}
