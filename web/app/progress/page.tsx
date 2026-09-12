import type { Metadata } from "next";
import { ProgressView } from "@/components/ProgressView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Growth Schematic",
  description: "Seu progresso de Junior a System Architect.",
  path: "/progress",
});

export default function ProgressPage() {
  return <ProgressView />;
}
