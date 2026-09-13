import type { Metadata } from "next";
import { TrackHome } from "@/components/TrackHome";
import {
  arquiteturaHome,
  arquiteturaLessons,
  arquiteturaNav,
  arquiteturaSimulador,
  sidebarTracks,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: arquiteturaHome.title,
  description: arquiteturaHome.description,
  path: arquiteturaHome.path,
  ogType: "website",
});

export default function ArquiteturaIndexPage() {
  const track = sidebarTracks.find((t) => t.id === "arquitetura")!;

  return (
    <TrackHome
      path="/arquitetura"
      eyebrow={arquiteturaHome.eyebrow}
      title={arquiteturaHome.title}
      lede={arquiteturaHome.description}
      courseName="Trilha Arquitetura e Microsserviços"
      footer="Trilha de Arquitetura por tema, rumo a Arquiteto de Software."
      lessons={arquiteturaLessons}
      simulador={arquiteturaSimulador}
      nav={arquiteturaNav}
      groups={track.groups}
    />
  );
}
