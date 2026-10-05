#!/usr/bin/env node
/**
 * Recolor lesson diagrams to dark-native palette (option A).
 * Keeps indigo brand; softens white-paper look on dark UI.
 * Run from web/: node scripts/recolor-diagrams-dark.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIAG = path.resolve(__dirname, "../public/diagrams");

/** Light → dark-native (aligned to app: near-black UI, indigo primary) */
const REPLACEMENTS = [
  // fills
  ["#ffffff", "#141a22"],
  ["#FFFFFF", "#141a22"],
  ["#fafafa", "#141a22"],
  ["#eef2ff", "#1e2438"], // indigo soft
  ["#ecfdf5", "#14241f"], // green soft
  ["#f0fdf4", "#14241f"], // green soft (mint)
  ["#fef3c7", "#2a2114"], // amber soft
  ["#fef9c3", "#2a2114"], // amber soft (pale yellow)
  // strokes / text
  ["#2b2b3d", "#3d4a5c"],
  ["#111827", "#e8eaed"],
  ["#1f2937", "#e8eaed"],
  ["#4b5563", "#9aa3b2"],
  ["#6b7280", "#8b95a5"],
  // accents (keep hue, slightly brighter for dark)
  ["#4f5bd5", "#818cf8"], // indigo → primary-ish
  ["#059669", "#34d399"],
  ["#b45309", "#fbbf24"],
];

const GLOB_PREFIXES = [
  "sd-",
  "redis-",
  "kafka-",
  "elasticsearch-",
  "zookeeper-",
  "cassandra-",
  "api-gateway-",
  "flink-",
  "lld-",
];

function shouldTouch(name) {
  return GLOB_PREFIXES.some((p) => name.startsWith(p)) && name.endsWith(".svg");
}

function recolor(svg) {
  let out = svg;
  for (const [from, to] of REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  // Ensure root has no forced white background
  if (!/fill="none"/.test(out.slice(0, 200)) && !out.includes('style="background')) {
    out = out.replace(
      /<svg([^>]*)>/,
      '<svg$1 style="background:transparent">',
    );
  }
  return out;
}

let n = 0;
for (const name of fs.readdirSync(DIAG)) {
  if (!shouldTouch(name)) continue;
  const full = path.join(DIAG, name);
  const before = fs.readFileSync(full, "utf8");
  const after = recolor(before);
  if (after !== before) {
    fs.writeFileSync(full, after);
    n += 1;
  }
}
console.log(`Recolored ${n} diagrams → dark-native`);
