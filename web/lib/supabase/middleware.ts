import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isDevBypass } from "@/lib/dev";
import { isLegacyHost, SITE_URL } from "@/lib/site";

const PUBLIC = new Set([
  "/login",
  "/acesso-restrito",
  "/auth/callback",
  "/robots.txt",
  "/sitemap.xml",
]);

function isPublic(pathname: string) {
  if (PUBLIC.has(pathname)) return true;
  if (pathname.startsWith("/diagrams/")) return true;
  return false;
}

function hostOf(request: NextRequest) {
  const raw =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  return raw.split(",")[0]?.trim().replace(/:\d+$/, "") ?? "";
}

/** Vercel/Supabase às vezes devolvem o `code` na homepage. Sem isto o login nunca fecha. */
function oauthLanding(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (!searchParams.has("code") || pathname === "/auth/callback") return null;
  const dest = new URL(request.nextUrl.pathname + request.nextUrl.search, SITE_URL);
  dest.pathname = "/auth/callback";
  if (!dest.searchParams.get("next")) dest.searchParams.set("next", "/");
  return dest;
}

export async function updateSession(request: NextRequest) {
  const host = hostOf(request);
  if (isLegacyHost(host)) {
    const dest =
      oauthLanding(request) ??
      new URL(request.nextUrl.pathname + request.nextUrl.search, SITE_URL);
    const status = request.nextUrl.searchParams.has("code") ? 307 : 308;
    return NextResponse.redirect(dest, status);
  }

  const oauth = oauthLanding(request);
  if (oauth) return NextResponse.redirect(oauth);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request });

  if (!url || !key) {
    if (isDevBypass() || isPublic(request.nextUrl.pathname)) return response;
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (!user && !isPublic(path) && !isDevBypass()) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  if (user && path === "/login") {
    const home = request.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    return NextResponse.redirect(home);
  }

  return response;
}
