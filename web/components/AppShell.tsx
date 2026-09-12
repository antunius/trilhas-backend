"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { CommandMenu } from "@/components/CommandMenu";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarContext } from "@/components/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLogin = path === "/login";
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
    [open, toggle, commandOpen, toggleCommand]
  );

  return (
    <ProgressProvider>
      <SidebarContext.Provider value={value}>
        <SiteHeader />
        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
        <div className={`app-shell${isLogin ? " login-shell" : ""}`}>
          {open && !isLogin ? (
            <button
              type="button"
              className="sidebar-backdrop"
              aria-label="Fechar índice"
              onClick={() => setOpen(false)}
            />
          ) : null}
          {isLogin ? null : <AppSidebar />}
          <main className="app-main">{children}</main>
        </div>
      </SidebarContext.Provider>
    </ProgressProvider>
  );
}
