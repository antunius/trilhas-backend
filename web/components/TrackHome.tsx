"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Gauge,
} from "lucide-react";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { TrackLogo } from "@/components/TrackLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courseJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import {
  isLessonUnlocked,
  isProgressHydrated,
  loadProgress,
  passedPaths,
} from "@/lib/progress";
import type { LessonMeta, NavItem, SidebarTrack } from "@/lib/catalog";
import { isTrackHome } from "@/lib/catalog";

type TrackHomeProps = {
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  footer: string;
  courseName: string;
  lessons: LessonMeta[];
  simulador: LessonMeta;
  nav: NavItem[];
  groups: SidebarTrack["groups"];
};

export function TrackHome({
  path,
  eyebrow,
  title,
  lede,
  footer,
  courseName,
  lessons,
  simulador,
  nav,
  groups,
}: TrackHomeProps) {
  const isKafka = path.startsWith("/kafka");
  const [passed, setPassed] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      if (!isProgressHydrated()) return;
      setPassed(passedPaths(loadProgress()));
      setReady(true);
    }
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, []);

  const byPath = new Map(lessons.map((l) => [l.path, l]));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <VisitTracker path={path} />
      <JsonLd
        data={courseJsonLd({
          name: courseName,
          description: lede,
          url: `${SITE_URL}${path}`,
        })}
      />

      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Trilhas</span>
          </Link>
        </Button>
      </div>

      <div className="flex items-start gap-4 mb-10">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
            isKafka
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          }`}
          aria-hidden="true"
        >
          <TrackLogo
            track={isKafka ? "kafka" : "arquitetura"}
            className="w-6 h-6"
          />
        </div>
        <div className="space-y-1.5 min-w-0">
          <Badge
            variant="outline"
            className="text-[11px] font-mono px-2 py-0 border-border/80 text-muted-foreground"
          >
            {eyebrow}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {lede}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {(() => {
          let lessonNumber = 0;
          return groups.map((group) => {
          const items = group.items.filter((item) => !isTrackHome(item.href));
          if (items.length === 0) return null;

          return (
            <section key={group.label} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h2>
                <div className="flex-1 h-px bg-border/60" />
              </div>

              <ul className="space-y-2">
                {items.map((item) => {
                  lessonNumber += 1;
                  const n = lessonNumber;
                  const lesson = byPath.get(item.href);
                  const isSim = item.href === simulador.path;
                  const unlocked =
                    !ready || isLessonUnlocked(nav, item.href, passed);
                  const done = passed.has(item.href);
                  const href = unlocked ? item.href : undefined;
                  const description = isSim
                    ? simulador.description
                    : lesson?.description ?? "";
                  const label = isSim ? simulador.title : lesson?.title ?? item.label;

                  const row = (
                    <div
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                        unlocked
                          ? "border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/30 shadow-sm"
                          : "border-border/40 bg-secondary/10 opacity-60"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : !unlocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : isSim ? (
                          <Gauge
                            className={`w-4 h-4 ${
                              isKafka ? "text-amber-400" : "text-indigo-400"
                            }`}
                          />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/70" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {String(n).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {label}
                          </span>
                          {isSim ? (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-mono px-1.5 py-0"
                            >
                              Mesa final
                            </Badge>
                          ) : null}
                        </div>
                        {description ? (
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {description}
                          </p>
                        ) : null}
                        {!unlocked ? (
                          <p className="text-[11px] text-muted-foreground/80">
                            Passe o simulador da aula anterior (4 de 5) para
                            desbloquear.
                          </p>
                        ) : null}
                      </div>

                      {unlocked ? (
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      ) : null}
                    </div>
                  );

                  return (
                    <li key={item.href}>
                      {href ? (
                        <Link href={href} className="group block no-underline">
                          {row}
                        </Link>
                      ) : (
                        row
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
          });
        })()}
      </div>

      <footer className="mt-16 pt-8 border-t border-border/60 text-xs text-muted-foreground text-center">
        {footer}
      </footer>
    </div>
  );
}
