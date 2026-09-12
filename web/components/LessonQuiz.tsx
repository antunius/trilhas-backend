"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";
import { shuffleQuestions, type GateQuestion } from "@/lib/gates";
import { fetchGateQuestions } from "@/lib/questions";
import { loadProgress, markGatePassed, passedPaths } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const NEED = 5;
const PASS_AT = 4;

export function LessonQuiz({
  path,
  onPassed,
}: {
  path: string;
  onPassed: () => void;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [already, setAlready] = useState(false);
  const [questions, setQuestions] = useState<GateQuestion[]>([]);
  const [round, setRound] = useState<GateQuestion[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function startRound(bank: GateQuestion[]) {
    setRound(shuffleQuestions(bank, NEED));
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  useEffect(() => {
    let alive = true;
    const passed = passedPaths(loadProgress()).has(path);
    setAlready(passed);
    if (passed) {
      setHydrated(true);
      return;
    }
    fetchGateQuestions(path).then((bank) => {
      if (!alive) return;
      setQuestions(bank);
      startRound(bank);
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, [path]);

  if (!hydrated) {
    return <p className="quiz-meta text-muted-foreground py-6">Carregando o simulador…</p>;
  }

  if (already) {
    return (
      <section
        className="lesson-quiz mt-12 p-6 rounded-xl bg-card border border-emerald-500/30 bg-emerald-500/5 shadow-sm space-y-3"
        id="simulador-aula"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold font-heading text-foreground">
            Simulador desta aula
          </h2>
        </div>
        <div className="text-sm text-emerald-300 leading-relaxed">
          Você já foi aprovado nesta aula (pelo menos {PASS_AT} de {NEED} acertos).
          A próxima lição já está desbloqueada no seu índice.
        </div>
      </section>
    );
  }

  if (!round.length) {
    return (
      <section
        className="lesson-quiz mt-12 p-6 rounded-xl bg-card border border-border/80 shadow-sm"
        id="simulador-aula"
      >
        <h2 className="text-lg font-bold font-heading text-foreground mb-2">
          Simulador desta aula
        </h2>
        <p className="quiz-meta text-xs text-muted-foreground">
          Banco de questões desta aula ainda não carregou.
        </p>
      </section>
    );
  }

  if (done) {
    const ok = score >= PASS_AT;
    return (
      <section
        className={`lesson-quiz mt-12 p-6 rounded-xl border shadow-sm space-y-4 ${
          ok
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-amber-500/10 border-amber-500/30"
        }`}
        id="simulador-aula"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ok ? (
              <Sparkles className="w-5 h-5 text-emerald-400" />
            ) : (
              <RotateCcw className="w-5 h-5 text-amber-400" />
            )}
            <h2 className="text-lg font-bold font-heading text-foreground">
              Resultado do Simulador
            </h2>
          </div>
          <Badge
            variant="outline"
            className={`font-mono text-xs px-2 py-0.5 ${
              ok
                ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/20"
                : "border-amber-500/40 text-amber-300 bg-amber-500/20"
            }`}
          >
            {score} de {NEED} acertos ({Math.round((score / NEED) * 100)}%)
          </Badge>
        </div>

        <div className="text-sm leading-relaxed text-foreground">
          {ok ? (
            <span className="text-emerald-300">
              Excelente! Você atingiu a meta mínima de {PASS_AT} acertos. A próxima aula
              foi destrancada na sua jornada.
            </span>
          ) : (
            <span className="text-amber-300">
              Você acertou {score} de {NEED}. Para destrancar a próxima aula são
              necessários pelo menos {PASS_AT} acertos (80%). Você pode sortear 5 novas
              questões e tentar novamente.
            </span>
          )}
        </div>

        <div className="quiz-actions pt-2">
          {ok ? null : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => startRound(questions)}
              className="gap-2 border-amber-500/40 text-foreground hover:bg-amber-500/20"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Tentar de novo</span>
            </Button>
          )}
        </div>
      </section>
    );
  }

  const item = round[i];
  const revealed = picked !== null;
  const progressPercent = Math.round((i / NEED) * 100);

  return (
    <section
      className="lesson-quiz mt-12 p-6 rounded-xl bg-card border border-border/80 shadow-sm space-y-6"
      id="simulador-aula"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold font-heading text-foreground">
              Simulador desta aula
            </h2>
          </div>
          <p className="quiz-meta text-xs text-muted-foreground mt-1">
            5 perguntas sorteadas. {PASS_AT} acertos destrancam a próxima lição.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
            Questão {i + 1} de {NEED}
          </Badge>
          <Badge
            variant="secondary"
            className="font-mono text-xs px-2 py-0.5 text-emerald-400"
          >
            {score} {score === 1 ? "acerto" : "acertos"}
          </Badge>
        </div>
      </div>

      <Progress value={progressPercent} className="h-1.5 bg-secondary" />

      {/* Question Card */}
      <article className="qcard space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
          {item.q}
        </h3>

        {/* Options */}
        <div className="opts space-y-2">
          {item.o.map((text, j) => {
            let containerCls =
              "border-border hover:border-primary/40 hover:bg-secondary/40";
            let icon = (
              <span className="w-4 h-4 rounded-full border border-border shrink-0 mt-0.5" />
            );

            if (revealed) {
              if (j === item.a) {
                containerCls =
                  "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-medium";
                icon = (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                );
              } else if (j === picked && j !== item.a) {
                containerCls =
                  "border-rose-500/60 bg-rose-500/10 text-rose-300 font-medium";
                icon = (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                );
              } else {
                containerCls = "opacity-50 border-border";
              }
            } else if (picked === j) {
              containerCls = "border-primary bg-primary/10 text-foreground";
              icon = (
                <span className="w-4 h-4 rounded-full border-2 border-primary bg-primary/40 shrink-0 mt-0.5" />
              );
            }

            return (
              <button
                type="button"
                key={j}
                disabled={revealed}
                onClick={() => setPicked(j)}
                className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all flex items-start gap-3 ${containerCls}`}
              >
                {icon}
                <span className="leading-relaxed flex-1">{text}</span>
              </button>
            );
          })}
        </div>

        {/* Why feedback */}
        {revealed ? (
          <div className="quiz-why p-4 rounded-lg bg-secondary/50 border border-border/80 text-xs sm:text-sm text-foreground/90 leading-relaxed mt-4 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{item.w}</span>
          </div>
        ) : null}
      </article>

      {/* Action Footer */}
      <div className="quiz-actions flex justify-end pt-2">
        {revealed ? (
          <Button
            type="button"
            size="sm"
            onClick={() => {
              const add = picked === item.a ? 1 : 0;
              const nextScore = score + add;
              if (i + 1 >= NEED) {
                setScore(nextScore);
                setDone(true);
                if (nextScore >= PASS_AT) {
                  markGatePassed(path);
                  onPassed();
                }
              } else {
                setScore(nextScore);
                setI(i + 1);
                setPicked(null);
              }
            }}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <span>{i + 1 >= NEED ? "Ver resultado" : "Próxima questão"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : null}
      </div>
    </section>
  );
}
