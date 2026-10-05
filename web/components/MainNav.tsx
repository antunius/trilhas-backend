"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  BookOpen,
  Zap,
  Users,
  Home,
  Terminal,
} from "lucide-react";
import { getNavSections, type NavSection } from "@/lib/nav";
import { cn } from "@/lib/utils";

const SECTION_ICON = {
  learn: BookOpen,
  practice: Zap,
  community: Users,
} as const;

export function MainNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const sections = getNavSections();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    learn: true,
    practice: false,
    community: false,
  });

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 h-14 px-5 border-b border-border shrink-0 hover:bg-secondary/40 transition-colors"
      >
        <span className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Terminal className="w-4 h-4" />
        </span>
        <span className="font-semibold tracking-tight text-foreground">
          codetoscale
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary",
          )}
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>

        {sections.map((section) => (
          <NavSectionBlock
            key={section.id}
            section={section}
            expanded={!!expanded[section.id]}
            onToggle={() =>
              setExpanded((prev) => ({
                ...prev,
                [section.id]: !prev[section.id],
              }))
            }
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}

function NavSectionBlock({
  section,
  expanded,
  onToggle,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  expanded: boolean;
  onToggle: () => void;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = SECTION_ICON[section.id];
  const sectionActive =
    pathname === section.href ||
    section.links.some(
      (l) => pathname === l.href || pathname.startsWith(`${l.href}/`),
    );

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          sectionActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
        aria-expanded={expanded}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">{section.label}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            expanded ? "rotate-0" : "-rotate-90",
          )}
        />
      </button>
      {expanded ? (
        <div className="ml-3 pl-3 border-l border-border space-y-0.5 mt-1">
          <Link
            href={section.href}
            onClick={onNavigate}
            className={cn(
              "block rounded-md px-3 py-2 text-sm transition-colors",
              pathname === section.href
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            Visão geral
          </Link>
          {section.links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <div key={link.href + link.label}>
                {link.dividerBefore ? (
                  <div className="my-2 border-t border-border" />
                ) : null}
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <span className="flex-1 line-clamp-1">{link.label}</span>
                  {link.badge ? (
                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
