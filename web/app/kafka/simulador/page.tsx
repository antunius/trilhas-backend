import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { Pager } from "@/components/Pager";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { GateWall } from "@/components/GateWall";
import { TrackLogo } from "@/components/TrackLogo";
import { kafkaNav, kafkaSimulador, neighbors } from "@/lib/catalog";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: kafkaSimulador.title,
  description: kafkaSimulador.description,
  path: kafkaSimulador.path,
});

export default function KafkaQuizPage() {
  const { prev } = neighbors(kafkaNav, kafkaSimulador.path);
  return (
    <div className="wrap max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <VisitTracker path={kafkaSimulador.path} />
      <JsonLd
        data={articleJsonLd({
          headline: kafkaSimulador.title,
          description: kafkaSimulador.description,
          url: `${SITE_URL}${kafkaSimulador.path}`,
        })}
      />
      <Link
        href="/kafka"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kafka
      </Link>

      <div className="page-head flex items-start gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-amber-500/10 text-amber-400 border-amber-500/20"
          aria-hidden="true"
        >
          <TrackLogo track="kafka" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
            {kafkaSimulador.title}
          </h1>
          <p className="page-sub text-sm sm:text-base text-muted-foreground">
            {kafkaSimulador.description}
          </p>
        </div>
      </div>

      <GateWall path={kafkaSimulador.path} nav={kafkaNav}>
        <section id="simulador" className="article-content">
          <Quiz trackKey="kafka" />
        </section>
        <Pager prev={prev} />
      </GateWall>
      <footer className="mt-16 pt-8 border-t border-border/60 text-xs text-muted-foreground text-center">
        Trilha Kafka por tema, rumo a Tech Lead backend.
      </footer>
    </div>
  );
}
