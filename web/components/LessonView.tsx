"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, ArrowRight, BookOpen } from "lucide-react";
import { Pager } from "@/components/Pager";
import { LessonPlayer } from "@/components/LessonPlayer";
import { ScrollPlayer } from "@/components/ScrollPlayer";
import { LessonQuiz } from "@/components/LessonQuiz";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { LessonDoc } from "@/lib/beats";
import type { LessonMeta, NavItem } from "@/lib/catalog";
import { neighbors } from "@/lib/catalog";
import { isDevBypass } from "@/lib/dev";
import {
  firstPendingPath,
  isLessonUnlocked,
  isProgressHydrated,
  loadProgress,
  passedPaths,
} from "@/lib/progress";

export function LessonView({
  lesson,
  nav,
  doc,
}: {
  lesson: LessonMeta;
  nav: NavItem[];
  doc: LessonDoc;
}) {
  const { prev, next } = neighbors(nav, lesson.path);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passed, setPassed] = useState(false);
  const [pending, setPending] = useState<string | undefined>();
  const [atEnd, setAtEnd] = useState(false);

  function refresh() {
    if (!isProgressHydrated()) return;
    const state = loadProgress();
    const set = passedPaths(state);
    setUnlocked(isLessonUnlocked(nav, lesson.path, set));
    setPassed(set.has(lesson.path));
    setPending(firstPendingPath(nav, set));
    setReady(true);
  }

  useEffect(() => {
    refresh();
    window.addEventListener("trilhas-progress", refresh);
    return () => window.removeEventListener("trilhas-progress", refresh);
  }, [lesson.path, nav]);

  const nextLocked = Boolean(next) && !passed && !isDevBypass();

  if (!ready) {
    return (
      <div className="space-y-4 py-8">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="gate-wall p-6 sm:p-8 rounded-xl bg-card border border-amber-500/30 bg-amber-500/5 shadow-sm space-y-4 my-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Esta lição está bloqueada
            </h2>
            <p className="text-xs text-muted-foreground">
              Para destrancar, conclua o simulador da aula anterior com pelo menos 4 de 5 acertos.
            </p>
          </div>
        </div>

        {pending ? (
          <div className="pt-2">
            <Button asChild size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <Link href={pending}>
                <BookOpen className="w-4 h-4" />
                <span>Ir para a aula pendente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  const useScroll =
    lesson.path.startsWith("/kafka/") &&
    doc.beats.some((b) => b.kind === "secao");

  return (
    <>
      {useScroll ? (
        <ScrollPlayer path={lesson.path} doc={doc} onLastBeat={setAtEnd} />
      ) : (
        <LessonPlayer path={lesson.path} doc={doc} onLastBeat={setAtEnd} />
      )}
      {atEnd ? <LessonQuiz path={lesson.path} onPassed={refresh} /> : null}
      <Pager prev={prev} next={next} nextLocked={nextLocked} />
    </>
  );
}
