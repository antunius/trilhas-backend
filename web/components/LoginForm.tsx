"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { authCallbackUrl, isLocalHost, SITE_URL } from "@/lib/site";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function Form() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(
    params.get("error") === "auth"
      ? "Não foi possível autenticar. Tente novamente."
      : null,
  );
  const [pending, setPending] = useState(false);
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  async function enter() {
    if (!configured) {
      setError("Faltam as chaves do Supabase neste deploy.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const supabase = createClient();
      const next = params.get("next") || "/";
      const origin = isLocalHost(window.location.hostname)
        ? window.location.origin
        : SITE_URL;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: authCallbackUrl(origin, next) },
      });
      if (authError) {
        setError(authError.message);
        setPending(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login.");
      setPending(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-icon" aria-hidden="true">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      </div>

      <div className="auth-head">
        <h1>Bem-vindo de volta</h1>
        <p>Entre com sua conta Google para continuar</p>
      </div>

      {error ? (
        <div className="auth-error" role="alert">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        className="btn outline"
        onClick={() => void enter()}
        disabled={pending}
      >
        <GoogleIcon />
        {pending ? "Abrindo o Google…" : "Continuar com Google"}
      </button>

      <p className="auth-footer">
        Progresso e simuladores ficam salvos na sua conta, em qualquer navegador.
      </p>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="auth-card">
          <p className="quiz-meta">Carregando…</p>
        </div>
      }
    >
      <Form />
    </Suspense>
  );
}
