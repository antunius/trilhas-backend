import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dataDir = path.join(root, "data");

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (em web/.env.local).",
  );
  process.exit(1);
}

const supabase = createClient(url, service, { auth: { persistSession: false } });

const kafkaGates = [
  "fundamentos", "anatomia", "cluster", "dinamica", "garantias", "pratica", "sintese",
];
const arqGates = [
  "mapa", "sistema", "latencia", "disponibilidade", "cap", "acid", "monolito",
  "sincrono", "cache", "replicacao", "indice", "escala", "resiliencia",
  "decomposicao", "dados", "observabilidade", "system-design", "staff",
  "catalogo", "referencia",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function gateRows(track, slug) {
  const { questions } = readJson(path.join(dataDir, "gates", track, `${slug}.json`));
  return questions.map((q, i) => ({
    track,
    bank: "gate",
    lesson_slug: slug,
    tag: q.t ?? null,
    prompt: q.q,
    options: q.o,
    answer_index: q.a,
    why: q.w,
    sort_order: i,
  }));
}

function simuladorRows(track, file) {
  const { questions, topics } = readJson(path.join(dataDir, file));
  const topicRows = Object.entries(topics).map(([tag, t]) => ({
    track,
    tag,
    name: t.name,
    href: t.href,
  }));
  const qRows = questions.map((q, i) => ({
    track,
    bank: "simulador",
    lesson_slug: "simulador",
    tag: q.t,
    prompt: q.q,
    options: q.o,
    answer_index: q.a,
    why: q.w,
    sort_order: i,
  }));
  return { topicRows, qRows };
}

async function insertBatches(table, rows, size = 200) {
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(table, i, error.message);
      process.exit(1);
    }
    process.stdout.write(`  ${table} ${Math.min(i + chunk.length, rows.length)}/${rows.length}\n`);
  }
}

const questions = [];
for (const slug of kafkaGates) questions.push(...gateRows("kafka", slug));
for (const slug of arqGates) questions.push(...gateRows("arquitetura", slug));

const kafkaSim = simuladorRows("kafka", "kafka-quiz.json");
const arqSim = simuladorRows("arquitetura", "arquitetura-quiz.json");
questions.push(...kafkaSim.qRows, ...arqSim.qRows);
const topics = [...kafkaSim.topicRows, ...arqSim.topicRows];

console.log("Limpando tabelas…");
const delQ = await supabase.from("questions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
if (delQ.error) {
  console.error(delQ.error.message);
  process.exit(1);
}
const delT = await supabase.from("quiz_topics").delete().neq("track", "__none__");
if (delT.error) {
  console.error(delT.error.message);
  process.exit(1);
}

console.log(`Inserindo ${questions.length} perguntas e ${topics.length} temas…`);
await insertBatches("quiz_topics", topics);
await insertBatches("questions", questions);
console.log("Seed ok.");
