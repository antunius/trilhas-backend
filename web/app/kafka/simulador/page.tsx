import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";
import { Pager } from "@/components/Pager";
import { VisitTracker } from "@/components/VisitTracker";
import { JsonLd } from "@/components/JsonLd";
import { GateWall } from "@/components/GateWall";
import { kafkaNav, kafkaSimulador, neighbors } from "@/lib/catalog";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: kafkaSimulador.title,
  description: kafkaSimulador.description,
  path: kafkaSimulador.path,
});

export default function KafkaQuizPage() {
  const { prev } = neighbors(kafkaNav, kafkaSimulador.path);
  return (
    <div className="wrap">
      <VisitTracker path={kafkaSimulador.path} />
      <JsonLd
        data={articleJsonLd({
          headline: kafkaSimulador.title,
          description: kafkaSimulador.description,
          url: `${SITE_URL}${kafkaSimulador.path}`,
        })}
      />
      <Link href="/kafka" className="page-back">
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
        Kafka
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
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div>
          <h1>{kafkaSimulador.title}</h1>
          <p className="page-sub">{kafkaSimulador.description}</p>
        </div>
      </div>

      <GateWall path={kafkaSimulador.path} nav={kafkaNav}>
        <section id="simulador" className="article-content">
          <Quiz trackKey="kafka" />
        </section>
        <Pager prev={prev} />
      </GateWall>
      <footer>Trilha Kafka por tema, rumo a Tech Lead backend.</footer>
    </div>
  );
}
