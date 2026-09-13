import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { LessonView } from "@/components/LessonView";
import { TrackLogo } from "@/components/TrackLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LessonDoc } from "@/lib/beats";
import type { LessonMeta, NavItem } from "@/lib/catalog";
import { articleJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function LessonShell({
  trackHome,
  trackLabel,
  lesson,
  nav,
  doc,
  footer,
}: {
  trackHome: string;
  trackLabel: string;
  lesson: LessonMeta;
  nav: NavItem[];
  doc: LessonDoc;
  footer: string;
}) {
  const isKafka = lesson.path.startsWith("/kafka");

  return (
    <div className="wrap max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <VisitTracker path={lesson.path} />
      <JsonLd
        data={articleJsonLd({
          headline: lesson.title,
          description: lesson.description,
          url: `${SITE_URL}${lesson.path}`,
        })}
      />

      {/* Back navigation */}
      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <Link href={trackHome}>
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para {trackLabel}</span>
          </Link>
        </Button>
      </div>

      {/* Header section */}
      <div className="page-head flex items-start gap-4 mb-8">
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[11px] font-mono px-2 py-0 border-border/80 text-muted-foreground"
            >
              {lesson.eyebrow}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
            {lesson.title}
          </h1>
          <p className="page-sub text-sm sm:text-base text-muted-foreground">
            {lesson.description}
          </p>
        </div>
      </div>

      {/* Main interactive content */}
      <div className="article-content">
        <LessonView lesson={lesson} nav={nav} doc={doc} />
      </div>

      <footer className="mt-16 pt-8 border-t border-border/60 text-xs text-muted-foreground text-center">
        {footer}
      </footer>
    </div>
  );
}
