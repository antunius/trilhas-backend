"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, LogOut, User as UserIcon, Menu } from "lucide-react";
import { useSidebar } from "@/components/sidebar-context";
import { NavDrawer } from "@/components/NavDrawer";
import { createClient } from "@/lib/supabase/client";
import { flushProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

type HeaderUser = { name: string; avatar?: string };

/** Utility bar over main content (search + auth). Primary nav lives in the sidebar. */
export function SiteHeader() {
  const path = usePathname();
  const { open, setOpen, toggle, toggleCommand } = useSidebar();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);

  useEffect(() => setReady(true), []);
  const isLogin = path === "/login" || path === "/acesso-restrito";

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || isLogin) return;
    const supabase = createClient();
    function fromSession(
      u: {
        email?: string | null;
        user_metadata?: Record<string, unknown>;
      } | null,
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

  if (!ready) return null;

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={toggle}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {toggleCommand ? (
              <button
                type="button"
                onClick={toggleCommand}
                className="flex items-center gap-2 h-9 px-3 rounded-full bg-secondary/60 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground border border-border/80 transition-colors w-full max-w-md"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4 shrink-0" />
                <span className="truncate">Buscar...</span>
                <kbd className="ml-auto hidden sm:inline-flex font-mono text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-border">
                  ⌘K
                </kbd>
              </button>
            ) : null}
          </div>

          <div className="header-actions flex items-center gap-2 shrink-0">
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 px-2 text-muted-foreground"
                  >
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline max-w-[8rem] truncate text-xs">
                      {user.name}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => void signOut()}
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <NavDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
