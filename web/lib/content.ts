import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseLessonDoc, type LessonDoc, type Track } from "@/lib/beats";

export function lessonDoc(track: Track, slug: string): LessonDoc {
  const raw = readFileSync(
    join(process.cwd(), "content", track, `${slug}.json`),
    "utf8",
  );
  return parseLessonDoc(JSON.parse(raw), `${track}/${slug}`);
}
