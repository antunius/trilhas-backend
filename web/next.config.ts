import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "trilhas-backend.vercel.app" }],
        destination: "https://learning.codetoscale.dev/:path*",
        permanent: true,
      },
      // Legacy 19-lesson slugs → 7 chapters
      { source: "/kafka/modelo-mental", destination: "/kafka/fundamentos", permanent: true },
      { source: "/kafka/evento", destination: "/kafka/fundamentos", permanent: true },
      { source: "/kafka/topico", destination: "/kafka/anatomia", permanent: true },
      { source: "/kafka/particao", destination: "/kafka/anatomia", permanent: true },
      { source: "/kafka/offset", destination: "/kafka/anatomia", permanent: true },
      { source: "/kafka/key", destination: "/kafka/anatomia", permanent: true },
      { source: "/kafka/broker", destination: "/kafka/cluster", permanent: true },
      { source: "/kafka/isr", destination: "/kafka/cluster", permanent: true },
      { source: "/kafka/produtor", destination: "/kafka/cluster", permanent: true },
      { source: "/kafka/consumidor", destination: "/kafka/cluster", permanent: true },
      { source: "/kafka/rebalance", destination: "/kafka/dinamica", permanent: true },
      { source: "/kafka/retencao", destination: "/kafka/dinamica", permanent: true },
      { source: "/kafka/operacao", destination: "/kafka/pratica", permanent: true },
      { source: "/kafka/schema", destination: "/kafka/garantias", permanent: true },
      { source: "/kafka/outbox", destination: "/kafka/garantias", permanent: true },
      { source: "/kafka/spring", destination: "/kafka/pratica", permanent: true },
      { source: "/kafka/tech-lead", destination: "/kafka/sintese", permanent: true },
      // Older week-based URLs
      { source: "/kafka/semana-1", destination: "/kafka/anatomia", permanent: true },
      { source: "/kafka/semana-2", destination: "/kafka/garantias", permanent: true },
      { source: "/kafka/semana-3", destination: "/kafka/pratica", permanent: true },
      { source: "/kafka/semana-4", destination: "/kafka/garantias", permanent: true },
      { source: "/kafka/semana-5", destination: "/kafka/pratica", permanent: true },
      { source: "/kafka/semana-6", destination: "/kafka/sintese", permanent: true },
      { source: "/kafka/referencia", destination: "/kafka/sintese", permanent: true },
      { source: "/arquitetura/fundamentos", destination: "/arquitetura/mapa", permanent: true },
      { source: "/arquitetura/semana-1", destination: "/arquitetura/escala", permanent: true },
      { source: "/arquitetura/semana-2", destination: "/arquitetura/resiliencia", permanent: true },
      { source: "/arquitetura/semana-3", destination: "/arquitetura/decomposicao", permanent: true },
      { source: "/arquitetura/semana-4", destination: "/arquitetura/dados", permanent: true },
      { source: "/arquitetura/semana-5", destination: "/arquitetura/observabilidade", permanent: true },
    ];
  },
};

export default nextConfig;
