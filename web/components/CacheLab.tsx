"use client";

import { useMemo, useState } from "react";
import { Database, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

type Scene = "catalogo" | "saldo";

export function CacheLab() {
  const [scene, setScene] = useState<Scene>("catalogo");
  const [ttl, setTtl] = useState(60);
  const [users, setUsers] = useState(200);

  const { hit, stale, stampede, phrase, ok } = useMemo(() => {
    const baseHit = scene === "catalogo" ? 0.86 : 0.7;
    const ttlBoost = Math.min(0.12, ttl / 2000);
    const crowd = Math.min(0.18, users / 5000);
    const hitN = Math.round((baseHit + ttlBoost - crowd * 0.15) * 100);
    const staleN = ttl;
    const stampede = users >= 400 && ttl <= 30;
    const businessOk = scene === "catalogo" || ttl === 0;
    let phrase =
      "Catálogo: 2 s atrasado quase nunca quebra o checkout. Stampede é o risco quando o TTL estoura junto.";
    if (scene === "saldo" && ttl > 0) {
      phrase = `Saldo no cache por ${ttl}s: o gráfico de hit fica bonito e o débito mente. Quem lê o cache cobra errado.`;
    } else if (scene === "saldo") {
      phrase =
        "Saldo sem cache no caminho do débito. Mais lento. A invariante “não cobra duas vezes / não some dinheiro” segura.";
    } else if (stampede) {
      phrase =
        "TTL curto + 400+ requests: o item expira e o banco leva o rebanho. Jitter, lock ou refresh antes de expirar.";
    } else if (ttl >= 300) {
      phrase =
        "TTL longo: hit alto, invalidação vira o problema real. Preço do produto 44 pode ficar velho até alguém invalidar o cache.";
    }
    return {
      hit: Math.max(12, Math.min(97, hitN)),
      stale: staleN,
      stampede,
      phrase,
      ok: businessOk,
    };
  }, [scene, ttl, users]);

  return (
    <div
      className="explorer p-6 rounded-xl bg-card border border-border/80 shadow-sm space-y-6"
      aria-label="Laboratório de cache"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="font-bold font-heading text-foreground text-base">
            Laboratório de Cache & Consistência
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Escolha o tipo de dado e a duração do TTL. Cache hit alto não garante que a regra de negócio sobreviveu.
        </p>
      </div>

      {/* Scene Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={scene === "catalogo" ? "default" : "outline"}
          onClick={() => setScene("catalogo")}
          className="text-xs"
        >
          Catálogo · produto 44 (Leitura alta, tolerante)
        </Button>
        <Button
          type="button"
          size="sm"
          variant={scene === "saldo" ? "default" : "outline"}
          onClick={() => setScene("saldo")}
          className="text-xs"
        >
          Saldo · conta 99 (Invariante contábil estrita)
        </Button>
      </div>

      {/* Levers Controls */}
      <div className="space-y-5 p-4 rounded-lg bg-secondary/30 border border-border/60">
        {/* Slider 1: TTL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              Tempo de vida no cache (TTL)
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {ttl === 0 ? "Sem cache (0s)" : `${ttl} segundos`}
            </Badge>
          </div>
          <Slider
            min={0}
            max={300}
            step={15}
            value={[ttl]}
            onValueChange={(val) => setTtl(val[0])}
          />
        </div>

        {/* Slider 2: Requests */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              Requisições simultâneas na expiração
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {users} reqs/s
            </Badge>
          </div>
          <Slider
            min={10}
            max={800}
            step={10}
            value={[users]}
            onValueChange={(val) => setUsers(val[0])}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-lg border border-border/80 bg-secondary/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">Cache Hit Ratio</span>
            <span className="font-bold text-foreground font-mono">{hit}%</span>
          </div>
          <Progress value={hit} className="h-1.5 [&>div]:bg-emerald-400" />
        </div>

        <div className="p-3.5 rounded-lg border border-border/80 bg-secondary/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">Janela Stale (Inconsistência)</span>
            <span className="font-bold text-foreground font-mono">
              {stale === 0 ? "0 s (Consistente)" : `Até ${stale} s`}
            </span>
          </div>
          <Progress
            value={Math.min(100, (stale / 300) * 100)}
            className="h-1.5 [&>div]:bg-amber-400"
          />
        </div>
      </div>

      {/* Warnings & Alerts */}
      {stampede ? (
        <div className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>
            <strong>Cache Stampede:</strong> {users} conexões simultâneas furaram o cache no mesmo milissegundo e sobrecarregaram o banco de dados.
          </span>
        </div>
      ) : null}

      {!ok ? (
        <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            <strong>Invariante violada:</strong> O Cache Hit subiu, mas o saldo retornou defasado durante débito, provocando saques duplicados.
          </span>
        </div>
      ) : null}

      {/* Dynamic Phrase */}
      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-xs sm:text-sm text-foreground/90 leading-relaxed flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span>{phrase}</span>
      </div>
    </div>
  );
}
