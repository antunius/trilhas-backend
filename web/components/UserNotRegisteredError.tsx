"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UserNotRegisteredError() {
  async function signOut() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      window.location.href = "/login";
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div
          className="auth-icon"
          style={{
            background: "hsl(var(--chart-5) / 0.14)",
            borderColor: "hsl(var(--chart-5) / 0.35)",
            color: "hsl(var(--chart-5))",
          }}
          aria-hidden="true"
        >
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="auth-head">
          <h1>Acesso restrito</h1>
          <p>
            Sua conta não está liberada para usar este aplicativo. Peça acesso
            ao administrador.
          </p>
        </div>

        <div className="auth-error" role="status" style={{ marginBottom: "1.25rem" }}>
          <p style={{ margin: 0 }}>Se achar que é um engano, você pode:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-left">
            <li>Confirmar que entrou com a conta certa</li>
            <li>Pedir liberação ao administrador</li>
            <li>Sair e entrar de novo</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <button type="button" className="btn outline" onClick={() => void signOut()}>
            Sair e tentar outra conta
          </button>
          <Link href="/login" className="btn ghost text-center text-sm text-muted-foreground">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserNotRegisteredError;
