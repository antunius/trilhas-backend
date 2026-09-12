"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Zap,
  Boxes,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";
import { useSidebar } from "@/components/sidebar-context";
import {
  isTrackHome,
  sidebarTracks,
  trackIdFromPath,
  type SidebarTrack,
} from "@/lib/catalog";
import {
  isLessonUnlocked,
  isProgressHydrated,
  loadProgress,
  passedPaths,
  trackProgress,
} from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar() {
  const path = usePathname();
  const { open, setOpen } = useSidebar();
  const activeTrackId = trackIdFromPath(path);
  const [query, setQuery] = useState("");
  const [passed, setPassed] = useState<Set<string>>(new Set());
  const [openTracks, setOpenTracks] = useState<Record<string, boolean>>({
    kafka: true,
    arquitetura: true,
  });
  const [progress, setProgress] = useState({ done: 0, total: 1, pct: 0 });

  useEffect(() => {
    setQuery("");
    if (activeTrackId) {
      setOpenTracks({
        kafka: activeTrackId === "kafka",
        arquitetura: activeTrackId === "arquitetura",
      });
    } else {
      setOpenTracks({ kafka: true, arquitetura: true });
    }
  }, [path, activeTrackId]);

  useEffect(() => {
    function sync() {
      if (!isProgressHydrated()) return;
      const state = loadProgress();
      setPassed(passedPaths(state));
      const active = sidebarTracks.find((t) => t.id === activeTrackId);
      const paths = active
        ? active.nav.map((n) => n.href)
        : sidebarTracks.flatMap((t) => t.nav.map((n) => n.href));
      setProgress(trackProgress(active?.href ?? "/", paths));
    }
    sync();
    window.addEventListener("trilhas-progress", sync);
    return () => window.removeEventListener("trilhas-progress", sync);
  }, [path, activeTrackId]);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return sidebarTracks;
    return sidebarTracks
      .map((track) => {
        const trackHit = track.label.toLowerCase().includes(q);
        const groups = track.groups
          .map((group) => ({
            ...group,
            items: trackHit
              ? group.items
              : group.items.filter((item) =>
                  item.label.toLowerCase().includes(q)
                ),
          }))
          .filter((group) => group.items.length > 0);
        return { ...track, groups };
      })
      .filter((track) => track.groups.length > 0);
  }, [q]);

  function toggleTrack(id: string) {
    setOpenTracks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const levelLabel = activeTrackId
    ? sidebarTracks.find((t) => t.id === activeTrackId)?.label
    : "Visão Geral";

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        id="site-sidebar"
        className={`app-sidebar${open ? " open" : ""}`}
        data-track={activeTrackId}
        aria-label="Trilhas e conteúdos"
      >
        {/* Progress Card */}
        <div className="sidebar-progress p-4 border-b border-border/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {levelLabel}
            </span>
            <Badge variant="secondary" className="text-[11px] font-mono px-1.5 py-0">
              {progress.pct}%
            </Badge>
          </div>
          <Progress value={progress.pct} className="h-1.5 bg-secondary" />
          <p className="mt-2 text-xs text-muted-foreground">
            {progress.done} de {progress.total} aulas concluídas
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="sidebar-search p-3 border-b border-border/80">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar aulas..."
              aria-label="Buscar aula"
              className="w-full bg-secondary/50 border border-border/60 rounded-md py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Navigation Tree */}
        <nav className="sidebar-tree custom-scrollbar">
          {filtered.map((track) => (
            <TrackBlock
              key={track.id}
              track={track}
              expanded={Boolean(q) || Boolean(openTracks[track.id])}
              onToggle={() => toggleTrack(track.id)}
              activeHref={path}
              passed={passed}
              onNavigate={() => setOpen(false)}
            />
          ))}
          {filtered.length === 0 ? (
            <p className="sidebar-empty text-xs text-muted-foreground p-4 text-center">
              Nenhuma aula encontrada.
            </p>
          ) : null}
        </nav>
      </aside>
    </TooltipProvider>
  );
}

function TrackBlock({
  track,
  expanded,
  onToggle,
  activeHref,
  passed,
  onNavigate,
}: {
  track: SidebarTrack;
  expanded: boolean;
  onToggle: () => void;
  activeHref: string;
  passed: Set<string>;
  onNavigate: () => void;
}) {
  const panelId = `sidebar-${track.id}`;
  const isKafka = track.id === "kafka";

  return (
    <div className="sidebar-track" data-track={track.id}>
      <button
        type="button"
        className="sidebar-track-btn w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-secondary/40 transition-colors"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="flex items-center gap-2">
          {isKafka ? (
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Boxes className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{track.label}</span>
        </span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-90" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {expanded ? (
        <div id={panelId} className="sidebar-groups">
          {track.groups.map((group) => (
            <div key={group.label} className="sidebar-group">
              <p className="sidebar-group-label text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider px-3 pt-3 pb-1">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activeHref === item.href;
                  const done = passed.has(item.href) || isTrackHome(item.href);
                  const unlocked = isLessonUnlocked(track.nav, item.href, passed);

                  return (
                    <li key={item.href}>
                      {unlocked ? (
                        <Link
                          href={item.href}
                          className={`sidebar-link flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                            active
                              ? "active bg-primary/15 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          }`}
                          aria-current={active ? "page" : undefined}
                          onClick={onNavigate}
                        >
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                          )}
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="sidebar-link locked flex items-center gap-2 px-3 py-1.5 text-xs rounded-md text-muted-foreground/40 cursor-not-allowed select-none"
                              aria-disabled="true"
                            >
                              <Lock className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">
                              Passe o simulador da aula anterior (4 de 5) para desbloquear.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
