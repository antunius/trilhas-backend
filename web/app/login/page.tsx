import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Entrar",
  description: "Entre com o Google para estudar e guardar o progresso na sua conta.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="auth-layout">
      <LoginForm />
    </div>
  );
}
