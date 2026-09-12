"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, BookOpen, ArrowRight } from "lucide-react";
import type { NavItem } from "@/lib/catalog";
import {
  firstPendingPath,
  isLessonUnlocked,
  isProgressHydrated,
  loadProgress,
  passedPaths,
} from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function GateWall({
  path,
  nav,
  children,
}: {
  path: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pending, setPending] = useState<string | undefined>();

  useEffect(() => {
    function sync() {
      if (!isProgressHydrated()) return;
      const set = passedPaths(loadProgress());
      setUnlocked(isLessonUnlocked(nav, path, set));
      setPending(firstPendingPath(nav, set));
      setReady(true);
    }
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, [nav, path]);

  if (!ready) {
    return (
      <div className="space-y-4 py-8">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (unlocked) return children;

  return (
    <div className="gate-wall p-6 sm:p-8 rounded-xl bg-card border border-amber-500/30 bg-amber-500/5 shadow-sm space-y-4 my-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-foreground">
            Simulador de entrevista trancado
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Para desbloquear o simulador final, passe o simulador de cada aula com no mínimo 4 de 5 acertos.
          </p>
        </div>
      </div>

      {pending ? (
        <div className="pt-2">
          <Button asChild size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <Link href={pending}>
              <BookOpen className="w-4 h-4" />
              <span>Continuar de: {pending}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
