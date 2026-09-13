import type { Metadata } from "next";
import { TrackHome } from "@/components/TrackHome";
import {
  kafkaHome,
  kafkaLessons,
  kafkaNav,
  kafkaSimulador,
  sidebarTracks,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: kafkaHome.title,
  description: kafkaHome.description,
  path: kafkaHome.path,
  ogType: "website",
});

export default function KafkaIndexPage() {
  const track = sidebarTracks.find((t) => t.id === "kafka")!;

  return (
    <TrackHome
      path="/kafka"
      eyebrow={kafkaHome.eyebrow}
      title={kafkaHome.title}
      lede={kafkaHome.description}
      courseName="Trilha Apache Kafka"
      footer="Trilha Kafka por tema, rumo a Tech Lead backend."
      lessons={kafkaLessons}
      simulador={kafkaSimulador}
      nav={kafkaNav}
      groups={track.groups}
    />
  );
}
