import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const data = path.resolve(here, "../data/gates");

const kafka = [
  "modelo-mental", "evento", "topico", "particao", "offset", "key", "broker",
  "isr", "produtor", "consumidor", "rebalance", "retencao", "garantias",
  "operacao", "schema", "outbox", "spring", "sintese", "tech-lead",
];
const arq = [
  "mapa", "sistema", "latencia", "disponibilidade", "cap", "acid", "monolito",
  "sincrono", "cache", "replicacao", "indice", "escala", "resiliencia",
  "decomposicao", "dados", "observabilidade", "system-design", "staff",
  "catalogo", "referencia",
];

const brokenStem = /definição correta de |sobre “[^”]{40,}|no caderno desta aula/i;
const glueStem =
  /^(O mito é o contrário\.|Marque a opção verdadeira\.|Entre as opções:|Se misturarem conceitos:)|qual é o desenho certo\?|o que você responde na mesa\?/;
const gluedWrong = /com (some da partição|é um UUID global|é o group\.id)/i;
const kafkaAnalogy = /crachá|caderno|cartório|Analogia:|fila do banco|rasga a /i;
const arqAnalogy = /post-it|fotocópi|\bAnalogia\b|geladeira|caderno/i;
const labLeak = /\blab\b|README do|TopicConfig/;
// Sufixos do expandAsk: coladas num fragmento, viram duas frases e nenhuma pergunta.
const askSuffix =
  /(—\s*(verdade ou mito|o que acontece de verdade|como funciona|o que vale aqui)\?|^Na prática:|^Se perguntarem:)/i;
// As alternativas são sempre afirmações, então o enunciado não pode pedir uma contagem.
const countStem = /^(Quantas|Quantos|Quanto tempo)\b/i;
// As aulas de Arquitetura ensinam estes conceitos pelo nome em inglês. Traduzir
// no quiz quebra o vínculo: quem leu "breaker" não reconhece "disjuntor".
const traducao =
  /disjuntor|folga de falha|porta da frente|plant(ã|a)o|descoberta de servi(ç|c)o|captura de mudan(ç|c)a|tempo limite|tabela de sa(í|i)da|limite de chamadas|balanceador|espalhamento|nova tentativa|espera crescente|meio aberto|hash consistente|plano de execu(ç|c)(ã|a)o|varredura|chave de idempot(ê|e)ncia|identificador|armazenamento|aleatoriedade/i;

let failed = 0;
for (const [track, slugs] of [
  ["kafka", kafka],
  ["arquitetura", arq],
]) {
  for (const slug of slugs) {
    const file = path.join(data, track, `${slug}.json`);
    if (!fs.existsSync(file)) {
      console.error("missing", file);
      failed++;
      continue;
    }
    const { questions } = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(questions) || questions.length < 100) {
      console.error("short bank", track, slug, questions?.length);
      failed++;
      continue;
    }
    for (const q of questions) {
      if (
        !q.q ||
        !Array.isArray(q.o) ||
        q.o.length !== 4 ||
        typeof q.a !== "number" ||
        q.a < 0 ||
        q.a > 3 ||
        !q.w
      ) {
        console.error("bad question shape", track, slug, q.q);
        failed++;
        break;
      }
      const uniq = new Set(q.o.map((o) => String(o).trim().toLowerCase()));
      if (uniq.size !== 4) {
        console.error("duplicate options", track, slug, q.q);
        failed++;
        break;
      }
      const prefixes = q.o.map((o) => String(o).trim().toLowerCase().slice(0, 40));
      if (new Set(prefixes).size !== 4) {
        console.error("near-duplicate options", track, slug, q.q);
        failed++;
        break;
      }
      if (
        brokenStem.test(q.q) ||
        glueStem.test(q.q) ||
        gluedWrong.test(q.o.join(" "))
      ) {
        console.error("molde ruim", track, slug, q.q);
        failed++;
        break;
      }
      if (track === "kafka" && kafkaAnalogy.test(`${q.q} ${q.o.join(" ")}`)) {
        console.error("analogia", track, slug, q.q);
        failed++;
        break;
      }
      if (track === "arquitetura" && arqAnalogy.test(`${q.q} ${q.o.join(" ")} ${q.w ?? ""}`)) {
        console.error("analogia", track, slug, q.q);
        failed++;
        break;
      }
      const visible = `${q.q} ${q.o.join(" ")} ${q.w ?? ""}`;
      if (labLeak.test(visible)) {
        console.error("lab", track, slug, q.q);
        failed++;
        break;
      }
      if (track === "arquitetura" && askSuffix.test(q.q)) {
        console.error("sufixo colado no enunciado", track, slug, q.q);
        failed++;
        break;
      }
      if (track === "arquitetura" && countStem.test(q.q)) {
        console.error("enunciado pede contagem", track, slug, q.q);
        failed++;
        break;
      }
      // Imperativo ("Liste o que...") não combina com alternativas de múltipla escolha.
      if (track === "arquitetura" && !q.q.includes("?")) {
        console.error("enunciado não é pergunta", track, slug, q.q);
        failed++;
        break;
      }
      if (track === "arquitetura" && traducao.test(visible)) {
        console.error("termo traduzido; a aula usa o nome em inglês", track, slug, q.q);
        failed++;
        break;
      }
      // Enunciado que pede “o que perguntar / qual a pergunta / o que ligar”
      // vira metáfora sem conteúdo. A pergunta precisa ser sobre o fato.
      if (
        track === "arquitetura" &&
        /^(O que perguntar|Que pergunta|O que pedir)|qual a pergunta\?|desenhar a alavanca|ligar (o )?lote|ligar a segunda região/i.test(
          q.q,
        )
      ) {
        console.error("enunciado meta (perguntar/ligar/alavanca)", track, slug, q.q);
        failed++;
        break;
      }
      if (track === "arquitetura" && /\balavancas?\b/i.test(visible)) {
        console.error("metáfora alavanca no quiz", track, slug, q.q);
        failed++;
        break;
      }
    }
    // Cada fact de arquitetura tem c + 3 wrongs próprios, então todas as
    // perguntas de um tag precisam mostrar exatamente as mesmas alternativas.
    // Conjunto diferente dentro do tag significa erro vindo de outro assunto.
    if (track === "arquitetura") {
      const byTag = new Map();
      for (const q of questions) {
        const key = [...q.o]
          .map((o) => String(o).trim().toLowerCase())
          .sort()
          .join(" | ");
        const seenForTag = byTag.get(q.t);
        if (!seenForTag) {
          byTag.set(q.t, key);
        } else if (seenForTag !== key) {
          console.error("alternativas de outro tag", track, slug, q.t, q.q);
          failed++;
          break;
        }
      }
    }
  }
}

if (failed) {
  process.exit(1);
}
console.log("all gate banks ≥100, 4 opções únicas, sem molde colado");
