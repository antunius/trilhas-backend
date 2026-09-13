"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Menu,
  X,
  TrendingUp,
  LogOut,
  User as UserIcon,
  Terminal,
} from "lucide-react";
import { useSidebar } from "@/components/sidebar-context";
import { TrackLogo } from "@/components/TrackLogo";
import { trackIdFromPath } from "@/lib/catalog";
import { isDevBypass } from "@/lib/dev";
import { createClient } from "@/lib/supabase/client";
import { flushProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

type HeaderUser = { name: string; avatar?: string };

export function SiteHeader() {
  const path = usePathname();
  const { open, toggle, toggleCommand } = useSidebar();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);

  useEffect(() => setReady(true), []);
  const current = ready ? path : "";
  const track = trackIdFromPath(current);
  const isLogin = path === "/login";

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || isLogin) return;
    const supabase = createClient();
    function fromSession(
      u: {
        email?: string | null;
        user_metadata?: Record<string, unknown>;
      } | null
    ) {
      if (!u) {
        setUser(null);
        return;
      }
      const meta = u.user_metadata ?? {};
      const name =
        (typeof meta.full_name === "string" && meta.full_name) ||
        (typeof meta.name === "string" && meta.name) ||
        u.email ||
        "Conta";
      const avatar =
        typeof meta.avatar_url === "string"
          ? meta.avatar_url
          : typeof meta.picture === "string"
          ? meta.picture
          : undefined;
      setUser({ name, avatar });
    }
    supabase.auth.getUser().then(({ data }) => fromSession(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fromSession(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [isLogin]);

  async function signOut() {
    await flushProgress();
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="site-header" data-track={track}>
      <div className="inner">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href={isLogin ? "/login" : "/"}
            className="flex items-center gap-2 group text-foreground hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-base tracking-tight font-heading">
              Trilhas
            </span>
          </Link>

          {!isLogin && (
            <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground ml-2">
              <Link
                href="/kafka"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  path.startsWith("/kafka")
                    ? "bg-primary/15 text-primary font-medium"
                    : "hover:bg-secondary hover:text-foreground"
                }`}
              >
                <TrackLogo track="kafka" className="w-3.5 h-3.5 text-amber-400" />
                <span>Kafka</span>
              </Link>
              <Link
                href="/arquitetura"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  path.startsWith("/arquitetura")
                    ? "bg-primary/15 text-primary font-medium"
                    : "hover:bg-secondary hover:text-foreground"
                }`}
              >
                <TrackLogo track="arquitetura" className="w-3.5 h-3.5 text-indigo-400" />
                <span>Arquitetura</span>
              </Link>
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions flex items-center gap-2">
          {/* Quick Search Button (Cmd+K) */}
          {!isLogin && toggleCommand && (
            <button
              type="button"
              onClick={toggleCommand}
              className="flex items-center gap-2 h-8 px-2.5 sm:px-3 rounded-md bg-secondary/60 hover:bg-secondary text-xs text-muted-foreground hover:text-foreground border border-border/80 transition-colors shadow-sm cursor-pointer"
              aria-label="Buscar lições e comandos"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                ⌘K
              </kbd>
            </button>
          )}

          {!isLogin ? (
            <Link
              href="/progress"
              className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-md transition-colors ${
                path === "/progress"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Progresso</span>
            </Link>
          ) : null}

          {/* User Profile / Status */}
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 px-2 hover:bg-secondary"
                >
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt=""
                      width={22}
                      height={22}
                      className="rounded-full border border-border"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="text-xs font-medium max-w-[120px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Sessão autenticada
                  </p>
                </div>
                <Separator className="my-1" />
                <Link
                  href="/progress"
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-foreground hover:bg-accent rounded-sm transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <span>Ver Progresso Geral</span>
                </Link>
                <Separator className="my-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void signOut()}
                  className="w-full justify-start text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  <span>Sair da conta</span>
                </Button>
              </PopoverContent>
            </Popover>
          ) : isDevBypass() && !isLogin ? (
            <Badge
              variant="outline"
              className="text-[11px] text-amber-400 border-amber-500/30 bg-amber-500/10 font-mono hidden sm:inline-flex"
            >
              Dev · Aberto
            </Badge>
          ) : null}

          {/* Sidebar Toggle for Mobile / Desktop Drawer */}
          {isLogin ? null : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-secondary text-muted-foreground hover:text-foreground"
              aria-expanded={open}
              aria-controls="site-sidebar"
              aria-label={open ? "Fechar índice" : "Abrir índice"}
              onClick={toggle}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
