"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { isDevBypass } from "@/lib/dev";
import {
  clearProgressCache,
  flushProgress,
  hydrateLocalDev,
  hydrateProgressFromServer,
} from "@/lib/progress";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (isDevBypass()) hydrateLocalDev();
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    let alive = true;

    async function load(uid: string) {
      const { data, error } = await supabase
        .from("user_progress")
        .select(
          "user_id, visited, last_path, gates, quiz, sessions, simulador",
        )
        .eq("user_id", uid)
        .maybeSingle();
      if (!alive) return;
      if (error) console.error("Falha ao ler progresso", error.message);
      await hydrateProgressFromServer(uid, data);
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) void load(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        if (isDevBypass()) hydrateLocalDev();
        else clearProgressCache();
        return;
      }
      if (session?.user) void load(session.user.id);
    });

    const onHide = () => {
      void flushProgress();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onHide();
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
      window.removeEventListener("pagehide", onHide);
      void flushProgress();
    };
  }, []);

  return children;
}
