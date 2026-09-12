"use client";

import { useEffect } from "react";
import { isProgressHydrated, markVisited } from "@/lib/progress";

export function VisitTracker({ path }: { path: string }) {
  useEffect(() => {
    let marked = false;
    function tryMark() {
      if (!isProgressHydrated() || marked) return;
      marked = true;
      markVisited(path);
    }
    tryMark();
    window.addEventListener("trilhas-progress", tryMark);
    return () => window.removeEventListener("trilhas-progress", tryMark);
  }, [path]);
  return null;
}
