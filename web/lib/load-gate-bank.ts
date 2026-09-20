import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { GateQuestion } from "./gates";

export type GateTrack =
  | "system-design"
  | "code"
  | "behavioral"
  | "ai-coding"
  | "ml-system-design";

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

export function loadGateBank(track: GateTrack, slug: string): GateQuestion[] {
  const file = dataFile("gates", track, `${slug}.json`);
  if (!file) return [];
  const data = JSON.parse(readFileSync(file, "utf8")) as {
    questions: GateQuestion[];
  };
  return data.questions ?? [];
}

export function loadCourseBankManifest(categorySlug: string): string[] {
  const file = dataFile("gates", "course-banks.json");
  if (!file) return [];
  const data = JSON.parse(readFileSync(file, "utf8")) as Record<
    string,
    string[]
  >;
  return data[categorySlug] ?? [];
}
