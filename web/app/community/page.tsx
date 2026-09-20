import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Users } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "Comunidade",
  description:
    "Espaço para discussão e links da comunidade codetoscale (em construção).",
  path: "/community",
});

export default function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-primary mb-2">
        Comunidade
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
        Em construção
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
        Em breve: discussões por artigo, perguntas reportadas e um canal para
        trocar soluções. Por agora, use as trilhas e a Avaliação.
      </p>

      <div className="mt-10 space-y-3">
        <div className="rounded-xl border border-border bg-card px-5 py-5">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h2 className="font-medium text-foreground">
                Perguntas e discussão
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Comentários por artigo ainda não estão disponíveis. Enquanto
                isso, avance em{" "}
                <Link href="/learn" className="text-primary hover:underline">
                  Aprender
                </Link>{" "}
                e valide em{" "}
                <Link href="/practice" className="text-primary hover:underline">
                  Praticar
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div
          id="discord"
          className="rounded-xl border border-border bg-card px-5 py-5"
        >
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h2 className="font-medium text-foreground">Discord</h2>
              <p className="text-sm text-muted-foreground mt-1">
                O servidor da comunidade ainda não está aberto. Quando estiver,
                o link aparece aqui.
              </p>
              <Button variant="outline" size="sm" className="mt-3" disabled>
                Em breve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
