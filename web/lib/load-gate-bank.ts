import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { GateQuestion } from "./gates";
import type { QuizTopic } from "./questions";

function dataRoots() {
  const cwd = process.cwd();
  return [join(cwd, "data"), join(cwd, "web", "data")];
}

function dataFile(...parts: string[]) {
  for (const root of dataRoots()) {
    const file = join(root, ...parts);
    if (existsSync(file)) return file;
  }
  return null;
}

export function loadGateBank(
  track: "kafka" | "arquitetura",
  slug: string,
): GateQuestion[] {
  const file = dataFile("gates", track, `${slug}.json`);
  if (!file) return [];
  const data = JSON.parse(readFileSync(file, "utf8")) as {
    questions: GateQuestion[];
  };
  return data.questions ?? [];
}

export function loadSimuladorBank(track: "kafka" | "arquitetura"): {
  topics: Record<string, QuizTopic>;
  questions: GateQuestion[];
} {
  const file = dataFile(`${track}-quiz.json`);
  if (!file) return { topics: {}, questions: [] };
  return JSON.parse(readFileSync(file, "utf8")) as {
    topics: Record<string, QuizTopic>;
    questions: GateQuestion[];
  };
}
