import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, TrendingUp, Zap } from "lucide-react";
import { getQuizCategories } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Practice",
  description:
    "Avaliação por curso e acompanhamento de progresso.",
  path: "/practice",
});

export default function PracticePage() {
  const quizCats = getQuizCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-primary mb-2">
        Praticar
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
        Validar o que você estudou
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
        Use a Avaliação depois de ler os artigos — ou quando quiser
        checar lacunas.
      </p>

      <Link
        href="/progress"
        className="mt-8 flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/40 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground">Meu progresso</div>
          <div className="text-sm text-muted-foreground">
            Domínio por curso e histórico
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </Link>

      <div className="mt-6 space-y-2">
        {quizCats.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}/quiz`}
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">
                Avaliação · {cat.name}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {cat.description}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
