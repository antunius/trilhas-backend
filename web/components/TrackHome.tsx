import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, Boxes } from "lucide-react";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courseJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function TrackHome({
  path,
  num: _num,
  eyebrow: _eyebrow,
  title,
  lede,
  cards,
  footer,
  courseName,
}: {
  path: string;
  num: string;
  eyebrow: string;
  title: string;
  lede: string;
  cards: { href: string; tag: string; title: string; blurb: string }[];
  footer: string;
  courseName: string;
}) {
  const isKafka = path.startsWith("/kafka");

  return (
    <div className="wrap max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <VisitTracker path={path} />
      <JsonLd
        data={courseJsonLd({
          name: courseName,
          description: lede,
          url: `${SITE_URL}${path}`,
        })}
      />

      {/* Back button */}
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

      {/* Head */}
      <div className="page-head flex items-start gap-4 mb-8">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
            isKafka
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          }`}
          aria-hidden="true"
        >
          {isKafka ? <Zap className="w-6 h-6" /> : <Boxes className="w-6 h-6" />}
        </div>
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-[11px] font-mono px-2 py-0 border-border/80 text-muted-foreground"
          >
            {_eyebrow}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
            {title}
          </h1>
          <p className="page-sub text-sm sm:text-base text-muted-foreground">
            {lede}
          </p>
        </div>
      </div>

      {/* Cards list */}
      <div className="track-links grid grid-cols-1 gap-3.5">
        {cards.map((c) => (
          <Link
            href={c.href}
            key={c.href}
            className="group p-5 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:bg-secondary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-[11px] font-mono px-2 py-0 text-muted-foreground font-normal"
                >
                  {c.tag}
                </Badge>
                <span className="tl-title text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {c.title}
                </span>
              </div>
              <p className="tl-blurb text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {c.blurb}
              </p>
            </div>
            <div className="shrink-0 flex items-center text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t border-border/60 text-xs text-muted-foreground text-center">
        {footer}
      </footer>
    </div>
  );
}
