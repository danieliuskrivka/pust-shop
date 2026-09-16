import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function SheetContent({
  side = "left",
  title,
  children,
  className,
}: {
  side?: "left" | "right";
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <Dialog.Content
        aria-describedby={undefined}
        className={cn(
          "fixed z-50 flex h-dvh w-[min(20rem,88vw)] flex-col bg-card text-card-foreground shadow-[var(--shadow-border)] outline-none",
          side === "left" ? "inset-y-0 left-0" : "inset-y-0 right-0",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Dialog.Title className="font-display text-lg tracking-[0.14em] uppercase">
            {title}
          </Dialog.Title>
          <Dialog.Close className="inline-flex size-10 items-center justify-center rounded-md hover:bg-accent">
            <X className="size-4" />
            <span className="sr-only">Luk</span>
          </Dialog.Close>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
