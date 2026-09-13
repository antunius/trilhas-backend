export type NavItem = { href: string; label: string };

export type LessonMeta = {
  slug: string;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  ogType: "website" | "article";
};

const kafkaEyebrow = "Trilha 4 · Kafka";
const arqEyebrow = "Trilha 7 · Arquitetura";

type LessonDef = {
  slug: string;
  nav: string;
  title: string;
  description: string;
};

function lessonsFrom(
  prefix: string,
  eyebrow: string,
  defs: LessonDef[],
): LessonMeta[] {
  return defs.map((d) => ({
    slug: d.slug,
    path: `${prefix}/${d.slug}`,
    title: d.title,
    description: d.description,
    eyebrow,
    ogType: "article" as const,
  }));
}

const kafkaDefs: LessonDef[] = [
  {
    slug: "fundamentos",
    nav: "Fundamentos",
    title: "Kafka: do problema ao modelo",
    description:
      "O que é fila, o que é log, a analogia do caderno, eventos e por que a leitura não apaga a linha.",
  },
  {
    slug: "anatomia",
    nav: "Anatomia",
    title: "Anatomia do log",
    description:
      "Tópico, partição, offset e key — como o log é organizado por dentro, do nome até a linha.",
  },
  {
    slug: "cluster",
    nav: "Cluster",
    title: "O cluster",
    description:
      "Broker, réplica, ISR, acks, zero-copy, produtor, consumidor e consumer group.",
  },
  {
    slug: "dinamica",
    nav: "Dinâmica",
    title: "Ciclo de vida",
    description:
      "Rebalance, retenção, segmentos, compaction e event sourcing — o log não é eterno.",
  },
  {
    slug: "garantias",
    nav: "Garantias",
    title: "Garantias e padrões",
    description:
      "At-least-once, inbox, Schema Registry e outbox — entrega, contrato e dual write.",
  },
  {
    slug: "pratica",
    nav: "Na prática",
    title: "Na prática",
    description:
      "Spring Kafka, nove laboratórios, lag, DLT e o runbook de plantão.",
  },
  {
    slug: "sintese",
    nav: "Síntese",
    title: "Síntese e liderança",
    description:
      "O fluxo do pedido 99, checklist do arquiteto e decisões de Tech Lead.",
  },
];

const arqDefs: LessonDef[] = [
  {
    slug: "mapa",
    nav: "Mapa",
    title: "Ideia e mapa",
    description:
      "Arquitetura é decisão cara de reverter. Vocabulário antes de desenhar caixas.",
  },
  {
    slug: "sistema",
    nav: "Sistema",
    title: "Sistema, componente e fronteira",
    description:
      "O todo, a peça deployável e o contrato. Serviço não é pasta no Git.",
  },
  {
    slug: "latencia",
    nav: "Latência",
    title: "Latência, throughput e percentil",
    description:
      "Tempo de uma operação vs volume. SLO se escreve em p99, não na média.",
  },
  {
    slug: "disponibilidade",
    nav: "Disponibilidade",
    title: "Disponibilidade e consistência",
    description:
      "Disponível versus consistente. Eventual não é mentira permanente.",
  },
  {
    slug: "cap",
    nav: "CAP",
    title: "CAP e PACELC",
    description:
      "Partição é o gatilho. No dia ensolarado o dilema é latência versus consistência.",
  },
  {
    slug: "acid",
    nav: "ACID",
    title: "ACID vs mundo distribuído",
    description:
      "Rollback num resource manager. Dois bancos não compartilham a mesma transação.",
  },
  {
    slug: "monolito",
    nav: "Monolito",
    title: "Monolito, módulo e microsserviço",
    description:
      "Um deploy modular é o default. Vários deploys com o mesmo banco é o pior dos dois mundos.",
  },
  {
    slug: "sincrono",
    nav: "Síncrono",
    title: "Síncrono vs assíncrono",
    description:
      "Chamar e esperar versus publicar e seguir. Consulta na cara do usuário não é tópico.",
  },
  {
    slug: "cache",
    nav: "Cache",
    title: "Cache",
    description:
      "Atalho com TTL. Stampede, hot key e o custo de mostrar dado velho.",
  },
  {
    slug: "replicacao",
    nav: "Replicação",
    title: "Replicação vs sharding",
    description:
      "Cópia do mesmo dado versus fatiar o dataset. Lag de réplica e hot shard.",
  },
  {
    slug: "indice",
    nav: "Índice",
    title: "Índice",
    description:
      "Acelera aquele tipo de busca e deixa a escrita mais lenta. Índice ocioso é só custo.",
  },
  {
    slug: "escala",
    nav: "Escala",
    title: "SLO e escala",
    description: "Latência, throughput, SLO, índice, replicação, sharding e cache no desenho.",
  },
  {
    slug: "resiliencia",
    nav: "Resiliência",
    title: "Comunicação e resiliência",
    description:
      "Timeout, retry, breaker, bulkhead, fallback — nesta ordem. Gateway, BFF e evolução de API.",
  },
  {
    slug: "decomposicao",
    nav: "Decomposição",
    title: "Decomposição",
    description:
      "Quando não usar microsserviços, bounded context, banco compartilhado e Strangler Fig.",
  },
  {
    slug: "dados",
    nav: "Dados",
    title: "Dados distribuídos",
    description:
      "Saga, outbox, CQRS, event sourcing e idempotência em API de pagamento.",
  },
  {
    slug: "observabilidade",
    nav: "Observabilidade",
    title: "Observabilidade",
    description: "Métrica, trace, log, SLI, SLO, error budget e alerta acionável.",
  },
  {
    slug: "system-design",
    nav: "System design",
    title: "System design",
    description:
      "Os 45 minutos de entrevista: requisitos, estimativa, feed, assento e pagamento.",
  },
  {
    slug: "staff",
    nav: "Nível Staff",
    title: "Nível big tech",
    description:
      "Células, consistência real, blast radius — o que a mesa de Staff cobra além do glossário.",
  },
  {
    slug: "catalogo",
    nav: "Catálogo",
    title: "Catálogo de componentes",
    description: "API, escala, cache, storage, pipelines e comentários — uma peça por vez.",
  },
  {
    slug: "referencia",
    nav: "Arquiteto",
    title: "Virar a referência",
    description: "Julgamento de arquiteto: ADR, recusar microsserviço cedo e review de RFC.",
  },
];

export const kafkaLessons: LessonMeta[] = lessonsFrom(
  "/kafka",
  kafkaEyebrow,
  kafkaDefs,
);

export const arquiteturaLessons: LessonMeta[] = lessonsFrom(
  "/arquitetura",
  arqEyebrow,
  arqDefs,
);

export const kafkaNav: NavItem[] = [
  { href: "/kafka", label: "Início" },
  ...kafkaDefs.map((d) => ({ href: `/kafka/${d.slug}`, label: d.nav })),
  { href: "/kafka/simulador", label: "Simulador" },
];

export const arquiteturaNav: NavItem[] = [
  { href: "/arquitetura", label: "Início" },
  ...arqDefs.map((d) => ({ href: `/arquitetura/${d.slug}`, label: d.nav })),
  { href: "/arquitetura/simulador", label: "Simulador" },
];

export const kafkaHome: LessonMeta = {
  slug: "index",
  path: "/kafka",
  title: "Apache Kafka, em capítulos densos",
  description:
    "Trilha em sete capítulos rumo a Tech Lead backend: log distribuído, garantias, outbox e simulador de entrevista.",
  eyebrow: "Trilha 4 · rumo a Tech Lead backend",
  ogType: "website",
};

export const arquiteturaHome: LessonMeta = {
  slug: "index",
  path: "/arquitetura",
  title: "Arquitetura, em páginas curtas",
  description:
    "Trilha por tema rumo a arquiteto: mapa, system design, nível Staff e simulador de entrevista.",
  eyebrow: "Trilha 7 · rumo a Arquiteto de Software",
  ogType: "website",
};

export const kafkaSimulador: LessonMeta = {
  slug: "simulador",
  path: "/kafka/simulador",
  title: "Simulador de entrevista — Kafka",
  description: "50 perguntas, uma por vez. Sem gabarito no fim — só o mapa de gaps por tema.",
  eyebrow: kafkaEyebrow,
  ogType: "article",
};

export const arquiteturaSimulador: LessonMeta = {
  slug: "simulador",
  path: "/arquitetura/simulador",
  title: "Simulador de entrevista — Arquitetura",
  description: "60 perguntas, uma por vez. Sem gabarito no fim — só o mapa de gaps por tema.",
  eyebrow: arqEyebrow,
  ogType: "article",
};

export function findLesson(
  list: LessonMeta[],
  slug: string,
): LessonMeta | undefined {
  return list.find((l) => l.slug === slug);
}

export function neighbors(nav: NavItem[], path: string) {
  const i = nav.findIndex((n) => n.href === path);
  return {
    prev: i > 0 ? nav[i - 1] : undefined,
    next: i >= 0 && i < nav.length - 1 ? nav[i + 1] : undefined,
  };
}

export function isTrackHome(path: string) {
  return path === "/kafka" || path === "/arquitetura";
}

export function isSimuladorPath(path: string) {
  return path.endsWith("/simulador");
}

export function gatedPaths(nav: NavItem[]): string[] {
  return nav
    .filter((n) => !isTrackHome(n.href) && !isSimuladorPath(n.href))
    .map((n) => n.href);
}

export function navForPath(path: string): NavItem[] {
  if (path.startsWith("/arquitetura")) return arquiteturaNav;
  return kafkaNav;
}

export type SidebarGroup = {
  label: string;
  items: NavItem[];
};

export type SidebarTrack = {
  id: "kafka" | "arquitetura";
  href: string;
  label: string;
  nav: NavItem[];
  groups: SidebarGroup[];
};

export const sidebarTracks: SidebarTrack[] = [
  {
    id: "kafka",
    href: "/kafka",
    label: "Kafka",
    nav: kafkaNav,
    groups: [
      { label: "Fundação", items: kafkaNav.slice(0, 2) },
      { label: "Conceitos", items: kafkaNav.slice(2, 5) },
      { label: "Prática", items: kafkaNav.slice(5, 7) },
      { label: "Fechamento", items: kafkaNav.slice(7) },
    ],
  },
  {
    id: "arquitetura",
    href: "/arquitetura",
    label: "Arquitetura",
    nav: arquiteturaNav,
    groups: [
      { label: "Começo", items: arquiteturaNav.slice(0, 2) },
      { label: "Conceitos", items: arquiteturaNav.slice(2, 12) },
      { label: "Temas", items: arquiteturaNav.slice(12, 17) },
      { label: "Fechamento", items: arquiteturaNav.slice(17) },
    ],
  },
];

export function trackIdFromPath(path: string): SidebarTrack["id"] | undefined {
  if (path.startsWith("/arquitetura")) return "arquitetura";
  if (path.startsWith("/kafka")) return "kafka";
  return undefined;
}

export const allPublicPaths = [
  "/",
  "/progress",
  ...kafkaNav.map((n) => n.href),
  ...arquiteturaNav.map((n) => n.href),
];
