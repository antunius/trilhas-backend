"use client";

import { CourseSidebarNav } from "@/components/CourseSidebarNav";

/** Desktop persistent sidebar (Hello Interview layout). */
export function AppNavSidebar() {
  return (
    <aside
      className="app-nav-sidebar hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen w-[var(--nav-sidebar-w)] border-r border-border bg-background"
      aria-label="Navegação"
    >
      <CourseSidebarNav />
    </aside>
  );
}
