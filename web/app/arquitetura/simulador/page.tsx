import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { Pager } from "@/components/Pager";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { GateWall } from "@/components/GateWall";
import { TrackLogo } from "@/components/TrackLogo";
import { arquiteturaNav, arquiteturaSimulador, neighbors } from "@/lib/catalog";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: arquiteturaSimulador.title,
  description: arquiteturaSimulador.description,
  path: arquiteturaSimulador.path,
});

export default function ArquiteturaQuizPage() {
  const { prev } = neighbors(arquiteturaNav, arquiteturaSimulador.path);
  return (
    <div className="wrap max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <VisitTracker path={arquiteturaSimulador.path} />
      <JsonLd
        data={articleJsonLd({
          headline: arquiteturaSimulador.title,
          description: arquiteturaSimulador.description,
          url: `${SITE_URL}${arquiteturaSimulador.path}`,
        })}
      />
      <Link
        href="/arquitetura"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Arquitetura
      </Link>

      <div className="page-head flex items-start gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          aria-hidden="true"
        >
          <TrackLogo track="arquitetura" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
            {arquiteturaSimulador.title}
          </h1>
          <p className="page-sub text-sm sm:text-base text-muted-foreground">
            {arquiteturaSimulador.description}
          </p>
        </div>
      </div>

      <GateWall path={arquiteturaSimulador.path} nav={arquiteturaNav}>
        <section id="simulador" className="article-content">
          <Quiz trackKey="arquitetura" />
        </section>
        <Pager prev={prev} />
      </GateWall>
      <footer className="mt-16 pt-8 border-t border-border/60 text-xs text-muted-foreground text-center">
        Trilha de Arquitetura por tema, rumo a Arquiteto de Software.
      </footer>
    </div>
  );
}
