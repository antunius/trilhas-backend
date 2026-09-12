import type { Metadata } from "next";
import { HomeDashboard } from "@/components/HomeDashboard";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} — Kafka e arquitetura`,
  description: SITE_DESCRIPTION,
  path: "/",
  ogType: "website",
});

export default function HomePage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          inLanguage: "pt-BR",
        }}
      />
      <HomeDashboard />
    </div>
  );
}
