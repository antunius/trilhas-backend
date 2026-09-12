export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://learning.codetoscale.dev";

export const SITE_HOST = "learning.codetoscale.dev";
export const LEGACY_HOSTS = ["trilhas-backend.vercel.app"] as const;

export const SITE_NAME = "Trilhas Backend";
export const SITE_DESCRIPTION =
  "Kafka e arquitetura de software em linguagem de leigo: uma página por tema, simulador com cadeado e mesa de entrevista.";

export function isLocalHost(hostname: string) {
  const host = hostname.split(":")[0];
  return host === "localhost" || host === "127.0.0.1";
}

export function isLegacyHost(hostname: string) {
  const host = hostname.split(":")[0];
  return (LEGACY_HOSTS as readonly string[]).includes(host);
}

/** Origem do OAuth e dos redirects pós-login. Em produção ignora o host da Vercel. */
export function appOrigin(hostname?: string | null) {
  const host = (hostname ?? "").split(",")[0]?.trim() ?? "";
  if (isLocalHost(host)) {
    return `http://${host}`;
  }
  return SITE_URL;
}

export function authCallbackUrl(origin: string, next: string) {
  const path = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return `${origin.replace(/\/$/, "")}/auth/callback?next=${encodeURIComponent(path)}`;
}
