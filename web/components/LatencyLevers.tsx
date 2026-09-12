"use client";

import { useMemo, useState } from "react";
import { Gauge, ArrowRight, Zap, AlertTriangle, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function LatencyLevers() {
  const [linger, setLinger] = useState(0);
  const [hops, setHops] = useState(1);
  const [syncReplica, setSyncReplica] = useState(false);

  const { p50, p99, tps, phrase } = useMemo(() => {
    const hopMs = 18;
    const replicaMs = syncReplica ? 28 : 0;
    const lingerHit = linger * 0.7;
    const p50n = Math.round(12 + hops * hopMs + lingerHit + replicaMs);
    const tail = 40 + hops * 55 + (syncReplica ? 25 : 10) + linger * 0.4;
    const p99n = Math.round(p50n + tail);
    const batchBoost = 1 + linger / 12;
    const replicaTax = syncReplica ? 0.62 : 1;
    const hopTax = 1 / hops;
    const tpsn = Math.round(1800 * batchBoost * replicaTax * hopTax);
    let phrase =
      "Clique no checkout: pouca espera, poucas msgs/s. Pipeline ainda não agrupa.";
    if (linger >= 20 && hops === 1 && !syncReplica) {
      phrase =
        "Lote no pipeline: mais pedidos por segundo. A mensagem do 99 espera o lote fechar — o clique do cliente não deveria estar nesse caminho.";
    } else if (hops >= 3) {
      phrase =
        "Cada hop síncrono extra entra no p99. Frete + cupom + estoque na cara do POST: a cauda explode mesmo com p50 “ok”.";
    } else if (syncReplica) {
      phrase =
        "Réplica síncrona: o read vê o write. Cada insert espera o outro nó. Consistência no débito; latência no caixa.";
    }
    return { p50: p50n, p99: p99n, tps: tpsn, phrase };
  }, [linger, hops, syncReplica]);

  const p50Pct = clamp((p50 / 160) * 100, 6, 100);
  const p99Pct = clamp((p99 / 400) * 100, 8, 100);
  const tpsPct = clamp((tps / 8000) * 100, 8, 100);

  return (
    <div
      className="explorer p-6 rounded-xl bg-card border border-border/80 shadow-sm space-y-6"
      aria-label="Alavancas de latência"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-primary" />
          <h3 className="font-bold font-heading text-foreground text-base">
            Alavancas de Latência & Throughput
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Ajuste as três variáveis do sistema. Este simulador expõe o joelho matemático do trade-off distribuído.
        </p>
      </div>

      {/* Levers Controls */}
      <div className="space-y-5 p-4 rounded-lg bg-secondary/30 border border-border/60">
        {/* Slider 1: linger.ms */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              Lote no pipeline (<code className="text-primary font-mono text-[11px]">linger.ms</code>)
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {linger} ms
            </Badge>
          </div>
          <Slider
            min={0}
            max={50}
            step={5}
            value={[linger]}
            onValueChange={(val) => setLinger(val[0])}
          />
        </div>

        {/* Slider 2: Hops */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              Hops síncronos no clique
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {hops} {hops === 1 ? "hop" : "hops"}
            </Badge>
          </div>
          <Slider
            min={1}
            max={4}
            step={1}
            value={[hops]}
            onValueChange={(val) => setHops(val[0])}
          />
        </div>

        {/* Toggle 3: Sync Replica */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-foreground block">
              Replicação síncrona
            </span>
            <span className="text-[11px] text-muted-foreground block">
              O write só retorna após confirmação do nó réplica (acks=all)
            </span>
          </div>
          <Switch
            checked={syncReplica}
            onCheckedChange={setSyncReplica}
          />
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Métricas Resultantes
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* p50 */}
          <div className="p-3.5 rounded-lg border border-border/80 bg-secondary/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-mono">p50 Latência</span>
              <span className="font-bold text-foreground font-mono">{p50} ms</span>
            </div>
            <Progress value={p50Pct} className="h-1.5 [&>div]:bg-sky-400" />
          </div>

          {/* p99 */}
          <div className="p-3.5 rounded-lg border border-border/80 bg-secondary/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-mono">p99 (Cauda)</span>
              <span className="font-bold text-foreground font-mono">{p99} ms</span>
            </div>
            <Progress
              value={p99Pct}
              className={`h-1.5 ${p99 > 200 ? "[&>div]:bg-rose-500" : "[&>div]:bg-amber-400"}`}
            />
          </div>

          {/* throughput */}
          <div className="p-3.5 rounded-lg border border-border/80 bg-secondary/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-mono">Throughput</span>
              <span className="font-bold text-foreground font-mono">
                {tps.toLocaleString("pt-BR")}/s
              </span>
            </div>
            <Progress value={tpsPct} className="h-1.5 [&>div]:bg-emerald-400" />
          </div>
        </div>
      </div>

      {/* Dynamic trade-off analysis callout */}
      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-xs sm:text-sm text-foreground/90 leading-relaxed flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span>{phrase}</span>
      </div>
    </div>
  );
}
