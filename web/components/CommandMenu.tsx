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
import {
  kafkaLessons,
  arquiteturaLessons,
  kafkaSimulador,
  arquiteturaSimulador,
} from "@/lib/catalog";
import {
  Zap,
  Boxes,
  Gauge,
  Compass,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

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
    [isControlled, setControlledOpen]
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
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar lições, simuladores, conceitos..." />
      <CommandList className="max-h-[360px]">
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Acesso Rápido">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Compass className="h-4 w-4 text-primary" />
            <span>Início / Dashboard</span>
            <CommandShortcut className="text-xs">Home</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/progress"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Meu Progresso & Estatísticas</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Simuladores Interativos">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/kafka/simulador"))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Gauge className="h-4 w-4 text-amber-400" />
            <span>{kafkaSimulador.title}</span>
            <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/arquitetura/simulador"))
            }
            className="flex items-center gap-2 cursor-pointer"
          >
            <Gauge className="h-4 w-4 text-sky-400" />
            <span>{arquiteturaSimulador.title}</span>
            <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Trilha: Apache Kafka">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/kafka"))}
            className="flex items-center gap-2 cursor-pointer font-medium"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Visão Geral da Trilha Kafka</span>
          </CommandItem>
          {kafkaLessons.map((lesson) => (
            <CommandItem
              key={lesson.path}
              value={`kafka ${lesson.title} ${lesson.description}`}
              onSelect={() => runCommand(() => router.push(lesson.path))}
              className="flex items-center gap-2 cursor-pointer py-2"
            >
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium text-foreground">
                  {lesson.title}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {lesson.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Trilha: Arquitetura de Software">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/arquitetura"))}
            className="flex items-center gap-2 cursor-pointer font-medium"
          >
            <Boxes className="h-4 w-4 text-indigo-400" />
            <span>Visão Geral da Trilha Arquitetura</span>
          </CommandItem>
          {arquiteturaLessons.map((lesson) => (
            <CommandItem
              key={lesson.path}
              value={`arquitetura ${lesson.title} ${lesson.description}`}
              onSelect={() => runCommand(() => router.push(lesson.path))}
              className="flex items-center gap-2 cursor-pointer py-2"
            >
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium text-foreground">
                  {lesson.title}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {lesson.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
