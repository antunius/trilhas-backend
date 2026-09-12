/** Só vale em `next dev`. O build de produção da Vercel nunca liga isto. */
export function isDevBypass() {
  return process.env.NODE_ENV === "development";
}
