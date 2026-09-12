import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { kafkaTerms } from "./kafka-terms.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const data = path.resolve(here, "../data");

const GLUE = [
  "Microsserviço com banco compartilhado ainda é deploy independente.",
  "CDN é fonte da verdade para saldo e reserva de assento.",
  "Schema Registry versiona o tópico sem contrato entre times.",
  "Sticky session no pod é o jeito certo de escalar HPA.",
  "CQRS é o default de todo CRUD para “já nascer escalável”.",
  "Compaction apaga a mensagem no instante da leitura.",
  "Transação Kafka cobre Postgres e o gateway de cartão.",
  "Acks=all também impede duplicata no consumidor.",
  "O offset vira um ID global único no cluster inteiro.",
  "Linearizability sai de graça em qualquer Redis com replica.",
  "View materializada no primary de checkout substitui warehouse.",
  "Eventual permite invariante quebrada até o próximo deploy.",
  "Retry sem jitter e sem idempotência acelera a recuperação.",
  "CAP escolhe AP mesmo sem partição, no dia ensolarado.",
  "Load balancer e API gateway são o mesmo hop de política.",
  "Rate limit só no pod local basta atrás de NAT de operadora.",
  "UUID v4 é k-sortable e não fragmenta índice B-tree.",
  "O controller promove qualquer réplica, mesmo atrasada.",
  "Lambda e Kappa são só nomes de nuvem, sem trade-off de pipeline.",
  "Rebalance nunca pausa o grupo se o lag estiver alto.",
  "Offset pagination em feed evita duplicata quando chega item novo.",
  "Outbox é desnecessário se os dois commits forem no mesmo segundo.",
  "Consistent hashing elimina hot key de celebridade sozinha.",
  "HPA sozinho isola lock de linha e chamada lenta a PSP.",
  "Partições extras clonam a carga dentro da mesma key.",
];

const glueRe = new RegExp(
  `\\s+(${GLUE.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\.?$`,
);

function strip(option) {
  let s = String(option).trim();
  let prev;
  do {
    prev = s;
    s = s.replace(glueRe, "").trim();
  } while (s !== prev);
  return s.replace(/\s+/g, " ");
}

function cleanFile(file, { kafka = false } = {}) {
  const full = path.join(data, file);
  const json = JSON.parse(fs.readFileSync(full, "utf8"));
  let changed = 0;
  for (const q of json.questions) {
    const nextQ = kafka ? kafkaTerms(q.q) : q.q;
    if (nextQ !== q.q) {
      q.q = nextQ;
      changed += 1;
    }
    if (kafka && q.w) q.w = kafkaTerms(q.w);
    q.o = q.o.map((opt) => {
      let next = strip(opt);
      if (kafka) next = kafkaTerms(next);
      if (next !== opt) changed += 1;
      return next;
    });
    const seen = new Set();
    for (const opt of q.o) {
      const k = opt.toLowerCase();
      if (seen.has(k)) {
        throw new Error(`duplicate option after clean in ${file}: ${q.q}`);
      }
      seen.add(k);
    }
  }
  fs.writeFileSync(full, JSON.stringify(json, null, 2) + "\n");
  console.log(file, "cleaned", changed, "fields");
}

cleanFile("kafka-quiz.json", { kafka: true });
cleanFile("arquitetura-quiz.json");
