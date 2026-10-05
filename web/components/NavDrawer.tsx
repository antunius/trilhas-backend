"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CourseSidebarNav } from "@/components/CourseSidebarNav";

/** Mobile drawer — same tree as desktop sidebar. */
export function NavDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] p-0 flex flex-col lg:hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>Navegação</SheetTitle>
        </SheetHeader>
        <CourseSidebarNav onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
