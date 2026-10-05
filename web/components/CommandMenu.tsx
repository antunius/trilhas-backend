"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import categoriesJson from "@/content/categories.json";
import articlesIndex from "@/content/articles/index.json";
import type { ArticleMeta, Category } from "@/types/content";
import {
  Compass,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Zap,
  Layers,
  Users,
} from "lucide-react";

const CATEGORIES = categoriesJson as Category[];
const LEARN = CATEGORIES.filter(
  (c) => c.navGroup === "learn-primary" || c.navGroup === "learn-secondary",
);
const QUIZ = CATEGORIES.filter((c) => c.hasQuiz && !c.stub);
const ARTICLES = articlesIndex as ArticleMeta[];

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandMenu({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (isControlled && setControlledOpen) {
        setControlledOpen(nextOpen);
      } else {
        setInternalOpen(nextOpen);
      }
    },
    [isControlled, setControlledOpen],
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar em Aprender, Praticar e artigos..." />
      <CommandList className="max-h-[360px]">
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Acesso rápido">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Compass className="h-4 w-4 text-primary" />
            <span>Dashboard</span>
            <CommandShortcut className="text-xs">Home</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/learn"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Aprender</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/practice"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Praticar</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/community"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Users className="h-4 w-4 text-sky-400" />
            <span>Comunidade</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/progress"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Meu progresso</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Aprender">
          {LEARN.map((cat) => (
            <CommandItem
              key={cat.slug}
              value={`aprender ${cat.name} ${cat.description}`}
              onSelect={() =>
                runCommand(() => router.push(`/category/${cat.slug}`))
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              <Layers className="h-4 w-4 text-primary" />
              <span>{cat.name}</span>
              <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Praticar · Avaliação">
          {QUIZ.map((cat) => (
            <CommandItem
              key={`quiz-${cat.slug}`}
              value={`praticar quiz avaliação ${cat.name}`}
              onSelect={() =>
                runCommand(() => router.push(`/category/${cat.slug}/quiz`))
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>{cat.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Artigos">
          {ARTICLES.map((a) => (
            <CommandItem
              key={`${a.categorySlug}/${a.slug}`}
              value={`${a.title} ${a.summary} ${a.categorySlug}`}
              onSelect={() =>
                runCommand(() =>
                  router.push(`/category/${a.categorySlug}/${a.slug}`),
                )
              }
              className="flex items-center gap-2 cursor-pointer py-2"
            >
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium text-foreground">
                  {a.title}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {a.categorySlug}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
