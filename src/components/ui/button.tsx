import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-(--motion-quick) ease-(--ease-out) disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-border)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent shadow-[var(--shadow-border)]",
        ghost: "text-foreground hover:bg-accent",
        outline: "bg-card text-foreground hover:bg-accent shadow-[var(--shadow-border)]",
      },
      size: {
        default: "h-10 rounded-md px-4 text-sm",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-16 rounded-xl px-6 text-lg",
        icon: "size-10 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
