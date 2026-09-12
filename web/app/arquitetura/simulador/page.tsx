import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";
import { Pager } from "@/components/Pager";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { GateWall } from "@/components/GateWall";
import { arquiteturaNav, arquiteturaSimulador, neighbors } from "@/lib/catalog";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: arquiteturaSimulador.title,
  description: arquiteturaSimulador.description,
  path: arquiteturaSimulador.path,
});

export default function ArquiteturaQuizPage() {
  const { prev } = neighbors(arquiteturaNav, arquiteturaSimulador.path);
  return (
    <div className="wrap">
      <VisitTracker path={arquiteturaSimulador.path} />
      <JsonLd
        data={articleJsonLd({
          headline: arquiteturaSimulador.title,
          description: arquiteturaSimulador.description,
          url: `${SITE_URL}${arquiteturaSimulador.path}`,
        })}
      />
      <Link href="/arquitetura" className="page-back">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Arquitetura
      </Link>

      <div className="page-head">
        <div className="page-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <div>
          <h1>{arquiteturaSimulador.title}</h1>
          <p className="page-sub">{arquiteturaSimulador.description}</p>
        </div>
      </div>

      <GateWall path={arquiteturaSimulador.path} nav={arquiteturaNav}>
        <section id="simulador" className="article-content">
          <Quiz trackKey="arquitetura" />
        </section>
        <Pager prev={prev} />
      </GateWall>
      <footer>Trilha de Arquitetura por tema, rumo a Arquiteto de Software.</footer>
    </div>
  );
}
