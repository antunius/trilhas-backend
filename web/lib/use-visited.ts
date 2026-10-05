"use client";

import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";

/** Conjunto de caminhos de lições lidas, atualizado quando o progresso muda. */
export function useVisited(): Set<string> {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  useEffect(() => {
    const sync = () => setVisited(new Set(loadProgress().visited || []));
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, []);
  return visited;
}
