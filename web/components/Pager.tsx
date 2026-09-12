import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import type { NavItem } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";

export function Pager({
  prev,
  next,
  nextLocked,
}: {
  prev?: NavItem;
  next?: NavItem;
  nextLocked?: boolean;
}) {
  return (
    <nav
      className="pager-nav mt-12 pt-8 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4"
      aria-label="Navegação entre lições"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:bg-secondary/30 transition-all text-left shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              Aula Anterior
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next && nextLocked ? (
        <div className="flex flex-col p-4 rounded-xl border border-border/60 bg-secondary/20 text-muted-foreground/60 select-none text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs mb-1">
            <span className="font-mono uppercase tracking-wider text-[11px]">
              Próxima Aula
            </span>
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs text-muted-foreground/60">
            Passe o simulador desta aula (4 de 5) para destrancar.
          </span>
        </div>
      ) : next ? (
        <Link
          href={next.href}
          className="group flex flex-col p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:bg-secondary/30 transition-all text-right shadow-sm sm:col-start-2"
        >
          <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors">
            <span className="font-mono uppercase tracking-wider text-[11px]">
              Próxima Aula
            </span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {next.label}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
