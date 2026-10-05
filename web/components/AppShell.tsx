"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AppNavSidebar } from "@/components/AppNavSidebar";
import { CommandMenu } from "@/components/CommandMenu";
import { ProgressProvider } from "@/components/ProgressProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarContext } from "@/components/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLogin = path === "/login" || path === "/acesso-restrito";
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("sidebar-open");
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const toggleCommand = useCallback(() => setCommandOpen((v) => !v), []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      commandOpen,
      setCommandOpen,
      toggleCommand,
    }),
    [open, toggle, commandOpen, toggleCommand],
  );

  return (
    <ProgressProvider>
      <SidebarContext.Provider value={value}>
        <ScrollToTop />
        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
        {isLogin ? (
          <div className="app-shell login-shell">
            <main className="app-main">{children}</main>
          </div>
        ) : (
          <div className="app-shell hi-shell">
            <AppNavSidebar />
            <div className="app-content-col">
              <SiteHeader />
              <main className="app-main">{children}</main>
            </div>
          </div>
        )}
      </SidebarContext.Provider>
    </ProgressProvider>
  );
}
