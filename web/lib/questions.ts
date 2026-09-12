import type { GateQuestion } from "@/lib/gates";
import { isDevBypass } from "@/lib/dev";
import { createClient } from "@/lib/supabase/client";

export type QuizTopic = { name: string; href: string };

type QuestionRow = {
  prompt: string;
  options: string[];
  answer_index: number;
  why: string;
  tag: string | null;
};

function toGate(row: QuestionRow): GateQuestion {
  return {
    q: row.prompt,
    o: row.options,
    a: row.answer_index,
    w: row.why,
    t: row.tag ?? undefined,
  };
}

async function fetchLocalGate(path: string): Promise<GateQuestion[]> {
  const res = await fetch(`/api/dev/questions?path=${encodeURIComponent(path)}`);
  if (!res.ok) return [];
  const data = (await res.json()) as GateQuestion[];
  return Array.isArray(data) ? data : [];
}

export async function fetchGateQuestions(path: string): Promise<GateQuestion[]> {
  const parts = path.split("/").filter(Boolean);
  const track = parts[0];
  const slug = parts[1];
  if (track !== "kafka" && track !== "arquitetura") return [];
  if (!slug) return [];
  if (isDevBypass()) {
    const local = await fetchLocalGate(path);
    if (local.length) return local;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("prompt, options, answer_index, why, tag")
    .eq("track", track)
    .eq("bank", "gate")
    .eq("lesson_slug", slug)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error(error.message);
    return [];
  }
  return (data ?? []).map(toGate);
}

export async function fetchSimulador(track: "kafka" | "arquitetura"): Promise<{
  topics: Record<string, QuizTopic>;
  questions: GateQuestion[];
}> {
  if (isDevBypass()) {
    const res = await fetch(
      `/api/dev/simulador?track=${encodeURIComponent(track)}`,
    );
    if (res.ok) {
      const data = (await res.json()) as {
        topics?: Record<string, QuizTopic>;
        questions?: GateQuestion[];
      };
      if (data.questions?.length) {
        return {
          topics: data.topics ?? {},
          questions: data.questions,
        };
      }
    }
  }
  const supabase = createClient();
  const [{ data: topicRows, error: topicErr }, { data: qRows, error: qErr }] =
    await Promise.all([
      supabase.from("quiz_topics").select("tag, name, href").eq("track", track),
      supabase
        .from("questions")
        .select("prompt, options, answer_index, why, tag")
        .eq("track", track)
        .eq("bank", "simulador")
        .order("sort_order", { ascending: true }),
    ]);
  if (topicErr) console.error(topicErr.message);
  if (qErr) console.error(qErr.message);
  const topics: Record<string, QuizTopic> = {};
  for (const row of topicRows ?? []) {
    topics[row.tag] = { name: row.name, href: row.href };
  }
  return {
    topics,
    questions: (qRows ?? []).map(toGate),
  };
}
