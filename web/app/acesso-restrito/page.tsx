import type { Metadata } from "next";
import { UserNotRegisteredError } from "@/components/UserNotRegisteredError";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Acesso restrito",
  description: "Sua conta não está liberada para usar este aplicativo.",
  path: "/acesso-restrito",
});

export default function AcessoRestritoPage() {
  return <UserNotRegisteredError />;
}
